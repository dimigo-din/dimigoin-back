import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNumber,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";

import { GradeValues, ClassValues, GradeType } from "src/lib/types";

export class CreateMealTimetableDto {
  @ApiProperty()
  @IsNumber()
  @IsIn(GradeValues)
  grade: GradeType;

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
