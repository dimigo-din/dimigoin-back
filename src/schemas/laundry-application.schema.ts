import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type LaundryApplicationDocument = LaundryApplication & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class LaundryApplication {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "LaundryTimetable",
  })
  timetable: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
  })
  time: number;
}

export const LaundryApplicationSchema =
  SchemaFactory.createForClass(LaundryApplication);
