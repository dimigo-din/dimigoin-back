import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { ClassValues, GradeValues, StatusValues } from "src/common";

export type FrigoDocument = Frigo & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Frigo {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: (typeof GradeValues)[number];

  @Prop({
    required: true,
    type: Number,
    enum: ClassValues,
  })
  class: (typeof ClassValues)[number];

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Students",
  })
  id: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  reason: string;

  @Prop({
    required: true,
    type: String,
    enum: StatusValues,
  })
  status: string;
}

export const FrigoSchema = SchemaFactory.createForClass(Frigo);
