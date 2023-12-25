import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { Afterschool, Student } from "src/schemas";

import { AfterschoolDocument } from "./afterschool.schema";
import { options } from "./options";

export type AfterschoolApplicationDocument =
  HydratedDocument<AfterschoolApplication>;

// TODO: remove this
export type AfterschoolApplicationResponse = AfterschoolApplication &
  Document & {
    afterschoolInfo: AfterschoolDocument;
  };
@ApiExtraModels(Afterschool, Student)
@Schema(options)
export class AfterschoolApplication {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Afterschool) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Afterschool",
  })
  afterschool: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Student) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Types.ObjectId;
}

export const AfterschoolApplicationSchema = SchemaFactory.createForClass(
  AfterschoolApplication,
);
