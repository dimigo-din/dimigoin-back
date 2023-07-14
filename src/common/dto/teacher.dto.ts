import { Length, Matches, IsIn, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GenderValues, Permissions, PositionValues } from '../types';
import { Types } from 'mongoose';

export class CreateTeacherDto {
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
  @IsString()
  @IsIn(GenderValues)
  readonly gender: string;

  @ApiProperty()
  @IsMongoId({ each: true })
  readonly groups: string[];

  @ApiProperty()
  @IsMongoId({ each: true })
  permisssions: Permissions;

  @ApiProperty()
  @IsString({ each: true })
  @IsIn(PositionValues)
  readonly positions: string[];
}

export class addGroupDto {
  @ApiProperty()
  @IsMongoId()
  readonly teacherId: Types.ObjectId;

  @ApiProperty()
  @IsMongoId()
  readonly groupId: Types.ObjectId;
}
