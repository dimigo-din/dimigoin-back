import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { GradeValues } from "src/common";

import { AfterschoolDocument } from "./afterschool.schema";

export type AfterschoolApplicationDocument = AfterschoolApplication & Document;

export type AfterschoolApplicationResponse = AfterschoolApplication &
  Document & {
    afterschoolInfo: AfterschoolDocument;
  };

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class AfterschoolApplication {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: (typeof GradeValues)[number];

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Afterschool",
  })
  afterschool: Types.ObjectId;
}

export const AfterschoolApplicationSchema = SchemaFactory.createForClass(
  AfterschoolApplication,
);
