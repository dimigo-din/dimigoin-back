import type { Model } from "mongoose";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment-timezone";

import { AuthUser } from "../../../common";
import {
  MusicList,
  MusicListDocument,
  MusicVote,
  MusicVoteDocument,
} from "../../../schemas";

@Injectable()
export class MusicManageService {
  constructor(
    @InjectModel(MusicList.name)
    private musicListModel: Model<MusicListDocument>,
    @InjectModel(MusicVote.name)
    private musicVoteModel: Model<MusicVoteDocument>,
  ) {}

  async musicList(user: AuthUser) {
    const week = moment().format("yyyyww");

    const musics = await this.musicListModel.find({
      week,
      gender: user.gender,
      selectedDate: null,
    });

    const votes = (
      await this.musicVoteModel.aggregate([
        { $match: { week, gender: user.gender } },
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

        return {
          id: m.videoId,
          title: musicInfo.title,
          thumbnail: musicInfo.thumbnail_url,
          upVote,
          downVote,
        };
      }),
    );
  }

  async applyMusic(user: AuthUser, videoId: string) {
    const week = moment().format("yyyyww");

    const videoIdRegex = /[a-zA-Z0-9]*/;
    const videoIdCheck = videoIdRegex.exec(videoId);
    if (!videoIdCheck || videoIdCheck.length !== 1)
      new HttpException(
        "올바르지 않은 비디오 ID 입니다.",
        HttpStatus.BAD_REQUEST,
      );

    const validatedVideoId = videoIdCheck[0];

    const listCheck = await this.musicListModel.find({
      week,
      videoId: validatedVideoId,
    });
    if (listCheck.length > 0)
      throw new HttpException(
        "이미 신청된 기상곡입니다.",
        HttpStatus.BAD_REQUEST,
      );

    await new this.musicListModel({
      week,
      videoId: validatedVideoId,
      user: user._id,
    }).save();

    return true;
  }

  async select(user: AuthUser, videoId: string) {
    const day = moment().format("yyyyMMDD");
    const week = moment().format("yyyyww");

    const isApplied = await this.musicListModel.findOne({
      week,
      user: user._id,
      videoId,
    });
    if (!isApplied) await this.applyMusic(user, videoId);

    await this.musicListModel.findOneAndUpdate(
      { week, gender: user.gender, videoId },
      {
        $set: {
          selectedDate: day,
        },
      },
    );

    return true;
  }

  async delete(user: AuthUser, videoId: string) {
    const week = moment().format("yyyyww");

    const target = await this.musicListModel.findOne({
      week,
      user: user._id,
      videoId,
    });
    if (!target)
      throw new HttpException(
        "신청되지 않은 기상곡입니다.",
        HttpStatus.BAD_REQUEST,
      );

    await this.musicVoteModel.deleteMany({ target: target._id });
    target.deleteOne();
  }
}
