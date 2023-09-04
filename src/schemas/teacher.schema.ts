import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Permissions } from "src/common";

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

  @Prop({
    required: true,
    type: [String],
    enum: ["A", "T", "D"],
  })
  positions: string[];
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
