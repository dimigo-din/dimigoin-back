import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";
import { Types } from "mongoose";

import { LaundryType, LaundryValues } from "src/lib";

export class ApplyLaundryDto {
  @ApiProperty()
  @IsString()
  laundryTimetableId: Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsIn(LaundryValues)
  laundryType: LaundryType;
}
