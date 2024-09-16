import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class SelectDTO {
  @ApiProperty()
  @IsString()
  videoId: string;
}

export class DeleteDTO {
  @ApiProperty()
  @IsString()
  videoId: string;
}

export class TeacherMusicListDTO {
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
  upvote: number;

  @ApiProperty()
  @IsNumber()
  downVote: number;
}
