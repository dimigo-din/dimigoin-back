import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { ScheduleTypeValues, ScheduleType } from "src/common";

export type ScheduleDocument = Schedule & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Schedule {
  @Prop({
    required: true,
    type: String,
  })
  uid: string;

  @Prop({
    required: true,
    type: String,
    enum: ScheduleTypeValues,
  })
  type: ScheduleType;

  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @Prop({
    required: true,
    type: String,
  })
  name: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
