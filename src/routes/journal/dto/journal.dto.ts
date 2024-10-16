import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IsCustomDate } from "src/lib/validators";

export class CreateJournalDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  @IsCustomDate()
  date: string;
}
