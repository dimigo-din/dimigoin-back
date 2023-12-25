import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { GradeValues, TypeValues, Grade, Type } from "src/common/types";

import { options } from "./options";

export type EventDocument = HydratedDocument<Event>;
@Schema(options)
export class Event {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  startTime: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  endTime: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
  })
  stack: string[];

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: Grade;

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
    enum: TypeValues,
  })
  type: Type;
}

export const EventSchema = SchemaFactory.createForClass(Event);
