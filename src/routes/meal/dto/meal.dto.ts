import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNumber,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";

import { GradeValues, ClassValues } from "src/common/types";

export class CreateMealTimetableDto {
  @ApiProperty()
  @IsNumber()
  @IsIn(GradeValues)
  grade: (typeof GradeValues)[number];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(ClassValues.length)
  @ArrayMaxSize(ClassValues.length)
  @IsString({ each: true })
  lunch: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(ClassValues.length)
  @ArrayMaxSize(ClassValues.length)
  @IsString({ each: true })
  dinner: string[];
}
