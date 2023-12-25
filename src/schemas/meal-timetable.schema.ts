import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { GradeValues, Grade } from "src/common";

import { options } from "./options";

export type MealTimetableDocument = HydratedDocument<MealTimetable>;
@Schema(options)
export class MealTimetable {
  @ApiProperty()
  _id: Types.ObjectId;

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
    type: [String],
  })
  lunch: string[];

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
  })
  dinner: string[];
}

export const MealTimetableSchema = SchemaFactory.createForClass(MealTimetable);
