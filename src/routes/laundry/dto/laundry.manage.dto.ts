import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn, IsNumber, IsMongoId, IsArray } from "class-validator";
import { Types } from "mongoose";

import {
  GradeValues,
  GenderValues,
  PositionValues,
  Grade,
  Gender,
  Position,
} from "src/common/types";

export class CreateLaundryDto {
  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  gender: Gender;

  @ApiProperty()
  @IsNumber()
  floor: number;

  @ApiProperty()
  @IsString()
  @IsIn(PositionValues)
  position: Position;
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
  grade: Grade;

  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  gender: Gender;

  @ApiProperty()
  @IsNumber()
  @IsIn([0, 1])
  type: number;
}
