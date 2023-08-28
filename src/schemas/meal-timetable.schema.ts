import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GradeValues } from "../common";

export type MealTimetableDocument = MealTimetable & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class MealTimetable {
  @Prop({
    required: true,
    enum: GradeValues,
  })
  grade: number;

  @Prop({
    required: true,
  })
  lunch: string[];

  @Prop({
    required: true,
  })
  dinner: string[];
}

export const MealTimetableSchema = SchemaFactory.createForClass(MealTimetable);
