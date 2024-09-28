import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsIn,
  IsNumber,
  IsMongoId,
  IsArray,
  IsBoolean,
} from "class-validator";
import { Types } from "mongoose";

import {
  GradeValues,
  GenderValues,
  PositionValues,
  GradeType,
  GenderType,
  PositionType,
  LaundryValues,
  LaundryType,
} from "src/lib/types";

export class CreateLaundryDto {
  @ApiProperty()
  @IsString()
  @IsIn(LaundryValues)
  deviceType: LaundryType;

  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  gender: GenderType;

  @ApiProperty()
  @IsNumber()
  floor: number;

  @ApiProperty()
  @IsString()
  @IsIn(PositionValues)
  position: PositionType;
}

export class CreateLaundryTimetableDto {
  @ApiProperty()
  @IsMongoId()
  laundryId: Types.ObjectId;

  @ApiProperty()
  @IsArray()
  sequence: string[];

  @ApiProperty()
  @IsArray()
  @IsIn(GradeValues, { each: true })
  grade: GradeType;

  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  gender: GenderType;

  @ApiProperty()
  @IsBoolean()
  isStaySchedule: boolean;
}
