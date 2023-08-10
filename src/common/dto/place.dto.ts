import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePlaceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  group: Types.ObjectId;
}

export class CreatePlaceGroupDto {
  @ApiProperty()
  @IsString()
  name: string;
}
