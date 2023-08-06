import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';
import { ClassValues, GradeValues } from '../types';

export class ManageAfterschoolDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsIn(GradeValues, { each: true })
  grade: number[];

  @ApiProperty()
  @IsString()
  teacher: string;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsIn([1, 2], { each: true })
  time: number[];

  @ApiProperty()
  @IsString()
  weekday: string;
}
