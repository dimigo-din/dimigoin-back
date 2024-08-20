import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsObject,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
} from "class-validator";

import { Grade, Seat } from "src/common/types";
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
  seat: {
    M1: Seat;
    M2: Seat;
    M3: Seat;
    F1: Seat;
    F2: Seat;
    F3: Seat;
  };
}

export class DownloadStayExcelDTO {
  @ApiProperty()
  @IsNumber()
  grade: Grade;
}
