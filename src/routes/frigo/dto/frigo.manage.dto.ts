import { ApiProperty } from "@nestjs/swagger";

import { IsCustomDate } from "src/lib/validators";

export class CreateFrigoDto {
  @ApiProperty()
  @IsCustomDate()
  date: string;
}
