import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsMongoId,
  IsObject,
  IsString,
  IsIn,
  IsArray,
  Matches,
} from "class-validator";
import { Types } from "mongoose";
import { Seats, SeatValues, StatusValues } from "src/common/types";

import { dateRegex, dateRegexMessage } from "src/common/regex";

export class StayDateDTO {
  @ApiProperty()
  @IsString()
  @Matches(dateRegex, {
    message: dateRegexMessage,
  })
  date: string;

  @ApiProperty()
  @IsBoolean()
  free: boolean;
}

export class CreateStayDto {
  @ApiProperty()
  @IsArray()
  duration: Date[][];

  @ApiProperty()
  @IsBoolean()
  current: boolean;

  @ApiProperty()
  @IsString()
  @Matches(dateRegex, {
    message: dateRegexMessage,
  })
  start: string;

  @ApiProperty()
  @IsString()
  @Matches(dateRegex, {
    message: dateRegexMessage,
  })
  end: string;

  @ApiProperty()
  @Type(() => StayDateDTO)
  dates: StayDateDTO[];

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

export class ApplyStayDto {
  @ApiProperty()
  @IsString()
  @IsIn(SeatValues)
  seat: string;

  @ApiProperty()
  @IsString()
  reason: string;
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

export class StayOutgoMealDto {
  @ApiProperty()
  @IsBoolean()
  breakfast: boolean;

  @ApiProperty()
  @IsBoolean()
  lunch: boolean;

  @ApiProperty()
  @IsBoolean()
  dinner: boolean;
}

export class StayOutgoDurationDto {
  @ApiProperty()
  @IsString()
  start: Date;

  @ApiProperty()
  @IsString()
  end: Date;
}

export class ApplyStayOutgoDto {
  @ApiProperty()
  @IsBoolean()
  free: boolean;

  @ApiProperty()
  @IsString()
  date: Date;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsObject()
  @Type(() => StayOutgoMealDto)
  meal: StayOutgoMealDto;

  @ApiProperty()
  @IsObject()
  @Type(() => StayOutgoDurationDto)
  duration: StayOutgoDurationDto;
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
