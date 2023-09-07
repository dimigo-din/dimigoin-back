import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import {
  GradeValues,
  ClassValues,
  GenderValues,
  Grade,
  Class,
  Gender,
} from "src/common";

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
  grade: Grade;

  @Prop({
    required: true,
    type: Number,
    enum: ClassValues,
  })
  class: Class;

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
  gender: Gender;

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
