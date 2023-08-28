import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ClassValues, GradeValues } from "../common";

export type TimetableDocument = Timetable & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Timetable {
  @Prop({
    required: true,
  })
  date: Date;

  @Prop({
    required: true,
    enum: GradeValues,
  })
  grade: number;

  @Prop({
    required: true,
    enum: ClassValues,
  })
  class: number;

  @Prop({
    required: true,
  })
  sequence: string[];
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);
