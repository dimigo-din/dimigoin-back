import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsObject, IsString, IsIn } from 'class-validator';
import { Types } from 'mongoose';
import { StatusValues } from '../types';
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

export class ApplyStayDto {
  @ApiProperty()
  @IsString()
  seat: boolean;
}

export class RejectStayDto {
  @ApiProperty()
  @IsMongoId()
  user: string;
}

export class StayOutgoMealDto {
  @ApiProperty()
  @IsBoolean()
  breakfast: boolean;

  @ApiProperty()
  @IsBoolean()
  lunch: boolean;

  @ApiProperty()
  @IsBoolean()
  dinner: boolean;
}

export class StayOutgoDurationDto {
  @ApiProperty()
  @IsString()
  start: Date;

  @ApiProperty()
  @IsString()
  end: Date;
}

export class ApplyStayOutgoDto {
  @ApiProperty()
  @IsString()
  date: Date;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsObject()
  @Type(() => StayOutgoMealDto)
  meal: StayOutgoMealDto;

  @ApiProperty()
  @IsObject()
  @Type(() => StayOutgoDurationDto)
  duration: StayOutgoDurationDto;
}
export class ManageStayOutgoDto {
  @ApiProperty()
  @IsMongoId()
  outgo: string;

  @ApiProperty()
  @IsString()
  @IsIn(StatusValues)
  status: string;
}
