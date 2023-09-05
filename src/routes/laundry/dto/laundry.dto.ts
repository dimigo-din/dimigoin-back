import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

import { GenderValues, GradeValues } from "src/common/types";

export class CreateWasherDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsIn(GradeValues, { each: true })
  grade: (typeof GradeValues)[number][];

  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  readonly gender: (typeof GenderValues)[number];
}

export class EditWasherDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsIn(GradeValues, { each: true })
  grade: (typeof GradeValues)[number][];
}

export class ApplyLaundryDto {
  @ApiProperty()
  @IsString()
  laundryId: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  time: number;
}
