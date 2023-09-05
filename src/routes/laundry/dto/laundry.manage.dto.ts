import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn, IsNumber, IsMongoId, IsArray } from "class-validator";
import { Types } from "mongoose";

import { GenderValues, GradeValues, PositionValues } from "src/common/types";

export class CreateLaundryDto {
  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  gender: (typeof GenderValues)[number];

  @ApiProperty()
  @IsNumber()
  floor: number;

  @ApiProperty()
  @IsString()
  @IsIn(PositionValues)
  position: (typeof PositionValues)[number];
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
  grade: (typeof GradeValues)[number][];

  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  gender: (typeof GenderValues)[number];

  @ApiProperty()
  @IsNumber()
  @IsIn([0, 1])
  type: number;
}
