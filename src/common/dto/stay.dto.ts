import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

class StayDateDTO {
  @ApiProperty()
  @IsString()
  date: Date;

  @ApiProperty()
  @IsBoolean()
  outgo: boolean;
}

export class CreateStayDto {
  @ApiProperty()
  @IsString()
  start: Date;

  @ApiProperty()
  @IsString()
  end: Date;

  @ApiProperty()
  @Type(() => StayDateDTO)
  dates: StayDateDTO[];
}

export class ManageStayDto {
  @ApiProperty()
  @IsMongoId()
  stay: Types.ObjectId;

  @ApiProperty()
  @IsBoolean()
  current: boolean;
}
