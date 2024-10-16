import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

import { IsCustomDate } from "src/lib/validators";

import { CurfewType, CurfewValues } from "src/lib";

export class CreateFrigoRequestDto {
  @ApiProperty()
  @IsCustomDate()
  date: string;
}

export class ApplyStudentFrigoRequestDto {
  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsString()
  @IsIn(CurfewValues)
  curfew: CurfewType;
}
