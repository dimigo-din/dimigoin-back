import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestFrigoDto {
  @ApiProperty()
  @IsString()
  reason: string;
}
