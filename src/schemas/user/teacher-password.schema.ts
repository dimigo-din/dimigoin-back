import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { Teacher } from "src/schemas";

export type TeacherPasswordDocument = HydratedDocument<TeacherPassword>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

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
