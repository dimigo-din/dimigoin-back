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

import { GradeType, SeatType } from "src/lib/types";
import { IsCustomDate, IsCustomDateTime } from "src/lib/validators";

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
    M1: SeatType;
    M2: SeatType;
    M3: SeatType;
    F1: SeatType;
    F2: SeatType;
    F3: SeatType;
  };
}

export class DownloadStayExcelDTO {
  @ApiProperty()
  @IsNumber()
  grade: GradeType;
}
