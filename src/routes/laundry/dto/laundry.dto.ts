import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";

import { LaundryTimetable, LaundryApplication } from "src/schemas";

export class GetLaundriesResponse {
  @ApiProperty({
    type: [LaundryTimetable],
  })
  timetables: LaundryTimetable[];

  @ApiProperty({
    type: [LaundryApplication],
  })
  applications: LaundryApplication[];
}

export class ApplyLaundryDto {
  @ApiProperty()
  @IsString()
  laundryTimetableId: Types.ObjectId;
}
