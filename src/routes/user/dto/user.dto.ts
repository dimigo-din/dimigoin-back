import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class refreshTokenDto {
  @ApiProperty()
  @IsString()
  readonly token: string;
}
