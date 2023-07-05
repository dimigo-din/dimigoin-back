import { Length, Matches, IsIn, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClassValues, GenderValues, GradeValues } from '../types';

export class CreateStudentDto {
  @ApiProperty()
  @IsString()
  @Length(2, 6)
  @Matches(/^[가-힣]+$/, {
    message: '이름 형식에 맞게 작성해주세요.',
  })
  readonly name: string;

  @ApiProperty()
  @IsString()
  @Length(5, 30)
  @Matches(/^[a-z0-9._]/, {
    message: 'ID 형식은 a-z, 0-9, .과 _만 가능합니다.',
  })
  readonly id: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNumber()
  @IsIn(GradeValues)
  readonly grade: number;

  @ApiProperty()
  @IsNumber()
  @IsIn(ClassValues)
  readonly class: number;

  @ApiProperty()
  @IsNumber()
  readonly number: number;

  @ApiProperty()
  @IsString()
  @IsIn(GenderValues)
  readonly gender: string;

  @ApiProperty()
  @IsString()
  readonly birthday: Date;
}
