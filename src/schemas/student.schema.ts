import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import {
  GradeValues,
  ClassValues,
  GenderValues,
  Grade,
  Class,
  Gender,
} from "src/common";

import { Group } from "src/schemas";

import { options } from "./options";

export type StudentDocument = HydratedDocument<Student>;
@ApiExtraModels(Group)
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

  @ApiProperty({
    enum: GradeValues,
  })
  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: Grade;

  @ApiProperty({
    enum: ClassValues,
  })
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
    type: Number,
  })
  number: number;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: Gender;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    default: [],
  })
  permissions: string[];

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Group) }],
  })
  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: "Group",
    default: [],
  })
  groups: Group[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
