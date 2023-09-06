import { ApiProperty } from "@nestjs/swagger";

import { IsCustomDate } from "src/common/validators";

export class CreateFrigoDto {
  @ApiProperty()
  @IsCustomDate()
  date: string;
}
