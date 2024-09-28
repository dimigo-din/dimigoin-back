import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { GradeValues, GradeType } from "src/lib";

export type MealTimetableDocument = HydratedDocument<MealTimetable>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

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
  grade: GradeType;

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
