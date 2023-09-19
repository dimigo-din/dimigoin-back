import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { ScheduleTypeValues, ScheduleType } from "src/common";

export type ScheduleDocument = HydratedDocument<Schedule>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

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
