import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { GradeValues, Grade } from "src/common";

export type MealTimetableDocument = MealTimetable & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class MealTimetable {
  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: Grade;

  @Prop({
    required: true,
    type: [String],
  })
  lunch: string[];

  @Prop({
    required: true,
    type: [String],
  })
  dinner: string[];
}

export const MealTimetableSchema = SchemaFactory.createForClass(MealTimetable);
