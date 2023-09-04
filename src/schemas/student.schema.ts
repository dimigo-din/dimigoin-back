import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import {
  ClassValues,
  GenderValues,
  GradeValues,
  Permissions,
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
  grade: number;

  @Prop({
    required: true,
    type: Number,
    enum: ClassValues,
  })
  class: number;

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
  gender: string;

  @Prop({
    required: true,
    type: Object,
    default: { view: [], edit: [] },
  })
  permissions: Permissions;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Group",
  })
  groups: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
