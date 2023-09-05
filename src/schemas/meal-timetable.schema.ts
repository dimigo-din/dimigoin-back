import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { GradeValues } from "src/common";

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
  grade: (typeof GradeValues)[number];

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
