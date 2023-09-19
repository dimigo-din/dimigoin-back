import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsObject, IsString, IsIn } from "class-validator";

import { SeatValues } from "src/common/types";
import { IsCustomDate, IsCustomDateTime } from "src/common/validators";

import { Stay, StayApplication } from "src/schemas";

export class GetCurrentStayResponse {
  @ApiProperty()
  stay: Stay;

  @ApiProperty({
    type: [StayApplication],
  })
  applications: StayApplication[];
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
  @IsCustomDateTime()
  start: string;

  @ApiProperty()
  @IsString()
  @IsCustomDateTime()
  end: string;
}

export class ApplyStayOutgoDto {
  @ApiProperty()
  @IsBoolean()
  free: boolean;

  @ApiProperty()
  @IsString()
  @IsCustomDate()
  date: string;

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
