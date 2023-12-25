import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { Student } from "src/schemas";

import { options } from "./options";

export type JournalDocument = HydratedDocument<Journal>;
@ApiExtraModels(Student)
@Schema(options)
export class Journal {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Student) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  type: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  title: string;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
