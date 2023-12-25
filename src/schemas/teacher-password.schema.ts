import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { Teacher } from "src/schemas";

import { options } from "./options";

export type TeacherPasswordDocument = HydratedDocument<TeacherPassword>;
@ApiExtraModels(Teacher)
@Schema(options)
export class TeacherPassword {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Teacher) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Teacher",
  })
  teacher: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  hash: string;
}

export const TeacherPasswordSchema =
  SchemaFactory.createForClass(TeacherPassword);
