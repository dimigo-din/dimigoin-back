import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsIn,
  IsNumber,
  IsMongoId,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
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
  laundryType: LaundryType;

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

class LaundryTimetableSequenceDto {
  @ApiProperty()
  @IsOptional()
  applicant: Types.ObjectId;

  @ApiProperty()
  @IsString()
  timetable: string;
}

export class CreateLaundryTimetableDto {
  @ApiProperty()
  @IsMongoId()
  laundryId: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsIn(LaundryValues)
  laundryTimetableType: LaundryType;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => LaundryTimetableSequenceDto)
  sequence: LaundryTimetableSequenceDto[];

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
