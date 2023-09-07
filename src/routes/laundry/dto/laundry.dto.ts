import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

export class ApplyLaundryDto {
  @ApiProperty()
  @IsString()
  laundryId: Types.ObjectId;

  @ApiProperty()
  @IsNumber()
  time: number;
}
