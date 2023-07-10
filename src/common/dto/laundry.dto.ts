import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber } from 'class-validator';
import { IsString } from 'nestjs-swagger-dto';
import { GenderValues, GradeValues } from '../types';

export class CreateWasherDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsIn(GradeValues)
  grade: number[];

  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  readonly gender: string;
}

export class EditWasherDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsIn(GradeValues)
  grade: number[];
}

export class ApplyLaundryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  time: number;
}
