import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// TBD: 기능 추가시 수정
export class Permissions {
  @ApiProperty()
  view: string[];

  @ApiProperty()
  edit: string[];
}

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  permissions: Permissions;
}
