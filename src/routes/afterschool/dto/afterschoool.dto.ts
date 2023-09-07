import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsString } from "class-validator";

import { GradeValues, Grade } from "src/common/types";

export class ManageAfterschoolDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsIn(GradeValues, { each: true })
  grade: Grade;

  @ApiProperty()
  @IsString()
  teacher: string;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsIn([1, 2], { each: true })
  time: number[];

  @ApiProperty()
  @IsString()
  day: string;
}
