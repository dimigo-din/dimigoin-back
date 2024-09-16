import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNumber } from "class-validator";

export class SearchDTO {
  @ApiProperty()
  @IsString()
  query: string;
}

export class MusicApplyDTO {
  @ApiProperty()
  @IsString()
  videoId: string;
}

export class VoteDTO {
  @ApiProperty()
  @IsString()
  videoId: string;

  @ApiProperty()
  @IsBoolean()
  isUpVote: boolean;
}

class YouTubeSearchResultThumbnails {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;
}

class YouTubeSearchResultThumbnailsList {
  @ApiProperty({ type: YouTubeSearchResultThumbnails })
  @IsString()
  default: YouTubeSearchResultThumbnails;

  @ApiProperty({ type: YouTubeSearchResultThumbnails })
  @IsNumber()
  medium: YouTubeSearchResultThumbnails;

  @ApiProperty({ type: YouTubeSearchResultThumbnails })
  @IsNumber()
  high: YouTubeSearchResultThumbnails;
}

export class YouTubeSearchResultsDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  link: string;

  @IsString()
  @ApiProperty()
  kind: string;

  @ApiProperty()
  @IsString()
  publishedAt: string;

  @ApiProperty()
  @IsString()
  channelTitle: string;

  @ApiProperty()
  @IsString()
  channelId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: YouTubeSearchResultThumbnailsList })
  thumbnails: YouTubeSearchResultThumbnailsList;
}

export class MusicListDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  thumbnail: string;

  @ApiProperty()
  @IsNumber()
  upVote: number;

  @ApiProperty()
  @IsNumber()
  downVote: number;

  @ApiProperty()
  @IsBoolean()
  doILike: boolean;

  @ApiProperty()
  @IsBoolean()
  doIHate: boolean;
}
