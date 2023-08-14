import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
