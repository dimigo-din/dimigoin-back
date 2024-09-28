import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment-timezone";
import { Model } from "mongoose";
import youtubeSearch from "youtube-search";

import { RateLimitType } from "src/lib";

import {
  MusicList,
  MusicListDocument,
  MusicVote,
  MusicVoteDocument,
  RateLimit,
  RateLimitDocument,
} from "../../../schemas";

@Injectable()
export class MusicService {
  constructor(
    private configService: ConfigService,

    @InjectModel(MusicList.name)
    private musicListModel: Model<MusicListDocument>,
    @InjectModel(MusicVote.name)
    private musicVoteModel: Model<MusicVoteDocument>,
    @InjectModel(RateLimit.name)
    private rateLimitModel: Model<RateLimitDocument>,
  ) {}

  async list(user: string) {
    const week = moment().format("yyyyww");

    // 이번주에 신청된 전체 기상송 목록
    const musics = await this.musicListModel.find({
      week,
      selectedDate: null,
    });

    // 내 좋아요와 싫어요들
    const myVotes = await this.musicVoteModel.find({ week, user });

    // 기상송 별 좋아요 / 싫어요
    const votes = (
      await this.musicVoteModel.aggregate([
        { $match: { week } },
        {
          $group: {
            _id: {
              target: "$target",
              isUpVote: "$isUpVote",
            },
            count: { $sum: 1 },
          },
        },
      ])
    ).map((v) => {
      // 이놈이 votes에 최종 진화(?)
      return {
        target: v._id.target,
        isUpVote: v._id.isUpVote,
        count: v.count,
      };
    });

    // 정리해서 보내주기 리턴 형식은 Music DTO에 SongList에 명시됨
    return Promise.all(
      musics.map(async (m) => {
        // 음악 제목과 썸네일을 가져오기 위한 api
        const musicInfo = await (
          await fetch(
            `https://www.youtube.com/oembed?url=youtube.com/watch?v=${m.videoId}`,
          )
        ).json();

        // 특정 기상송의 투표 집계
        const vote = votes.filter((v) => v.target.equals(m._id));
        const upVote = (vote.find((v) => v.isUpVote) || { count: 0 }).count;
        const downVote = (vote.find((v) => !v.isUpVote) || { count: 0 }).count;

        // 투표를 안했을떄 불러오면 둘다 비활성이여야함. 그래서 doIHate 에서도 검사단 추가
        const doILike = !!myVotes.find(
          (v) => v.target.equals(m._id) && v.isUpVote,
        );
        const doIHate = !!myVotes.find(
          (v) => v.target.equals(m._id) && !v.isUpVote,
        );

        return {
          id: m.videoId,
          title: musicInfo.title,
          thumbnail: musicInfo.thumbnail_url,
          upVote,
          downVote,
          doILike,
          doIHate,
        };
      }),
    );
  }

  async search(user: string, query: string) {
    const type: RateLimitType = "YoutubeSearch";

    const rateLimit = await this.rateLimitModel.findOne({ type, user });
    if (
      process.env.NODE_ENV !== "dev" &&
      !!rateLimit &&
      !moment().isAfter(moment.unix(rateLimit.time).add(15, "seconds"))
    )
      throw new HttpException(
        "짧은 시간에 너무 많은 요청이 수신되었습니다.",
        HttpStatus.TOO_MANY_REQUESTS,
      );

    const opts: youtubeSearch.YouTubeSearchOptions = {
      maxResults: 10,
      key: this.configService.get<string>("YOUTUBE_API_KEY"),
    };
    const { results } = await youtubeSearch(query, opts);

    await this.rateLimitModel.deleteMany({ type, user });
    await new this.rateLimitModel({
      type,
      user,
      time: moment().unix(),
    }).save();

    const applyList = await this.list(user);
    return results.map((r) => {
      const apply = applyList.find((a) => a.id === r.id);
      return !!apply
        ? {
            id: r.id,
            title: r.title,
            thumbnail: r.thumbnails.high.url,
            upVote: apply.upVote,
            downVote: apply.downVote,
            doILike: apply.doILike,
            doIHate: apply.doIHate,
          }
        : {
            id: r.id,
            title: r.title,
            thumbnail: r.thumbnails.high.url,
            upVote: 0,
            downVote: 0,
            doILike: false,
            doIHate: false,
          };
    });
  }

  async applyMusic(user: string, videoId: string) {
    const day = moment().format("yyyyMMDD");
    const week = moment().format("yyyyww");

    const videoIdRegex = /^[a-zA-Z0-9]+$/;
    if (!videoIdRegex.test(videoId))
      throw new HttpException(
        "올바르지 않은 형식의 페이로드입니다.",
        HttpStatus.BAD_REQUEST,
      );

    const listCheck = await this.musicListModel.find({
      week,
      videoId,
    });
    if (listCheck.length > 0)
      throw new HttpException(
        "이미 신청된 기상곡입니다.",
        HttpStatus.BAD_REQUEST,
      );

    await new this.musicListModel({
      day,
      week,
      videoId,
      user,
    }).save();

    return true;
  }

  async voteMusic(user: string, videoId: string, isUpVote: boolean) {
    const day = moment().format("yyyyMMDD");
    const week = moment().format("yyyyww");

    const isApplied = await this.musicListModel.findOne({ week, videoId });
    if (!isApplied) await this.applyMusic(user, videoId); // 이거 유지할지 고민중입니당.

    const music = await this.musicListModel.findOne({ week, videoId }); // This cannot be null

    const userVote = await this.musicVoteModel.findOne({
      day,
      user,
      target: music._id,
    });
    if (userVote) userVote.deleteOne();
    if (userVote && userVote.isUpVote === isUpVote) return true;

    const userVotes = await this.musicVoteModel.find({ day, user });
    if (!!userVotes && userVotes.length > 3)
      throw new HttpException(
        "이미 할당된 투표권을 다 소진하였습니다.",
        HttpStatus.BAD_REQUEST,
      );

    await new this.musicVoteModel({
      week,
      day,
      user,
      target: music._id,
      isUpVote,
    }).save();

    return true;
  }
}
