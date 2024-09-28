import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import {
  GradeValues,
  ClassValues,
  GenderValues,
  GradeType,
  ClassType,
  GenderType,
} from "src/lib";

export type StudentDocument = HydratedDocument<Student>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Student {
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  email: string;

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
    type: Number,
    enum: ClassValues,
  })
  class: ClassType;

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
  })
  number: number;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: GenderType;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    default: [],
  })
  permissions: string[];

  @ApiProperty()
  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: "Group",
    default: [],
  })
  groups: Types.ObjectId[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
