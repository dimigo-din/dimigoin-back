import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsString } from "class-validator";

import { GradeValues } from "src/common/types";

export class CreateMealTimetableDto {
  @ApiProperty()
  @IsNumber()
  @IsIn(GradeValues)
  grade: number;

  @ApiProperty()
  @IsString({ each: true })
  lunch: string[];

  @ApiProperty()
  @IsString({ each: true })
  dinner: string[];
}
