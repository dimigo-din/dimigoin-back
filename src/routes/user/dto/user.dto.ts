import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  readonly token: string;
}
