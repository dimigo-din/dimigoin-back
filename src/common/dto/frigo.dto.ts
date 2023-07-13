import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RequestFrigoDto {
  @ApiProperty()
  @IsString()
  reason: string;
}

export class ManageFrigoDto {
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  frigo: Types.ObjectId;
}
