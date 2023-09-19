import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { GradeValues, ClassValues, Grade, Class } from "src/common";

export type TimetableDocument = HydratedDocument<Timetable>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

@Schema(options)
export class Timetable {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  date: string;

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
    enum: ClassValues,
  })
  class: Class;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
  })
  sequence: string[];
}

export const TimetableSchema = SchemaFactory.createForClass(Timetable);
