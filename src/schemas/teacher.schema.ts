import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { GenderValues } from "src/common/types";

export type TeacherDocument = Teacher & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Teacher {
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
    type: String,
    enum: ["M", "F"],
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

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
