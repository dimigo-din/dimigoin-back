import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class refreshTokenDto {
  @ApiProperty()
  @IsString()
  readonly token: string;
}
