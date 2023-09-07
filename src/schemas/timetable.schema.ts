import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { GradeValues, ClassValues, Grade, Class } from "src/common";

export type TimetableDocument = Timetable & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Timetable {
  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: Grade;

  @Prop({
    required: true,
    type: Number,
    enum: ClassValues,
  })
  class: Class;

  @Prop({
    required: true,
    type: [String],
  })
  sequence: string[];
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);
