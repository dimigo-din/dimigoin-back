import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate } from 'class-validator';
import { Types } from 'mongoose';

class StayDateDTO {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsBoolean()
  outgo: boolean;
}

export class CreateStayDto {
  @ApiProperty()
  @IsDate()
  start: Date;

  @ApiProperty()
  @IsDate()
  end: Date;

  @ApiProperty()
  @Type(() => StayDateDTO)
  dates: StayDateDTO[];
}

// export class ManageStayDto {
//   @ApiProperty()
//   @IsDate()
//   stay: Types.ObjectId;

//   @ApiProperty()
//   @IsDate()
//   end: Date;

//   @ApiProperty()
//   @Type(() => StayDateDTO)
//   dates: StayDateDTO[];
// }
