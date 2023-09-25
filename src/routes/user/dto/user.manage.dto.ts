import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePasswordDto {
  @ApiProperty()
  @IsString()
  password: string;
}
