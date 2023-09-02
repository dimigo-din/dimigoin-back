import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { GradeValues } from "../common";

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
    ref: "Students",
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    enum: GradeValues,
  })
  grade: number;

  @Prop({
    ref: "Afterschools",
    required: true,
  })
  afterschool: Types.ObjectId;
}

export const AfterschoolApplicationSchema = SchemaFactory.createForClass(
  AfterschoolApplication,
);
