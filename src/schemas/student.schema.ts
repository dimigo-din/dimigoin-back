import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { ClassValues, GenderValues, GradeValues } from "src/common";

export type StudentDocument = Student & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Student {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: (typeof GradeValues)[number];

  @Prop({
    required: true,
    type: Number,
    enum: ClassValues,
  })
  class: (typeof ClassValues)[number];

  @Prop({
    required: true,
    type: Number,
  })
  number: number;

  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: (typeof GenderValues)[number];

  @Prop({
    required: true,
    type: [String],
    default: [],
  })
  permissions: string[];

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: "Group",
    default: [],
  })
  groups: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
