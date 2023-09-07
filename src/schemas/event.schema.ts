import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { GradeValues, TypeValues, Grade, Type } from "src/common/types";

export type EventDocument = Event & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Event {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  startTime: string;

  @Prop({
    required: true,
    type: String,
  })
  endTime: string;

  @Prop({
    required: true,
    type: [String],
  })
  stack: string[];

  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: Grade;

  @Prop({
    required: true,
    type: Number,
    enum: TypeValues,
  })
  type: Type;
}

export const EventSchema = SchemaFactory.createForClass(Event);
