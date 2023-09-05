import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsMongoId,
  IsObject,
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";
import { Types } from "mongoose";

import { Seats, SeatValues, StatusValues } from "src/common/types";
import { IsCustomDate, IsCustomDateTime } from "src/common/validators";

export class StayDateDto {
  @ApiProperty()
  @IsString()
  @IsCustomDate()
  date: string;

  @ApiProperty()
  @IsBoolean()
  free: boolean;
}

export class StayDurationDto {
  @ApiProperty()
  @IsString()
  @IsCustomDateTime()
  start: string;

  @ApiProperty()
  @IsString()
  @IsCustomDateTime()
  end: string;
}

export class CreateStayDto {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @ValidateNested()
  @Type(() => StayDurationDto)
  duration: StayDurationDto[];

  @ApiProperty()
  @IsString()
  @IsCustomDate()
  start: string;

  @ApiProperty()
  @IsString()
  @IsCustomDate()
  end: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested()
  @Type(() => StayDateDto)
  dates: StayDateDto[];

  @ApiProperty()
  @IsObject()
  seat: Seats;
}

export class ManageStayDto {
  @ApiProperty()
  @IsMongoId()
  stay: Types.ObjectId;

  @ApiProperty()
  @IsBoolean()
  current: boolean;
}

export class ApplyStayForceDto {
  @ApiProperty()
  @IsMongoId()
  user: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsIn(SeatValues)
  seat: string;

  @ApiProperty()
  @IsString()
  reason: string;
}

export class RejectStayDto {
  @ApiProperty()
  @IsMongoId()
  user: string;
}

export class ManageStayOutgoDto {
  @ApiProperty()
  @IsMongoId()
  outgo: string;

  @ApiProperty()
  @IsString()
  @IsIn(StatusValues)
  status: string;
}
