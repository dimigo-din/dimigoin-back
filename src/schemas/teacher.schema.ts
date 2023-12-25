import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { GenderValues, Gender } from "src/common/types";

import { Group } from "src/schemas";

import { options } from "./options";

export type TeacherDocument = HydratedDocument<Teacher>;
@Schema(options)
@ApiExtraModels(Group)
export class Teacher {
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

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
