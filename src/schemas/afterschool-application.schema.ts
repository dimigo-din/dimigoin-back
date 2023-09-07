import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

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
    ref: "Afterschool",
  })
  afterschool: Types.ObjectId;

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
