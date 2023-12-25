import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { ScheduleTypeValues, ScheduleType } from "src/common";

import { options } from "./options";

export type ScheduleDocument = HydratedDocument<Schedule>;
@Schema(options)
export class Schedule {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  uid: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: ScheduleTypeValues,
  })
  type: ScheduleType;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  name: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
