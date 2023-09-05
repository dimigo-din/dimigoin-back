import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { GradeValues, AfterschoolTimeValues } from "src/common/types";

export type AfterschoolDocument = Afterschool & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Afterschool {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  subject: string;

  @Prop({
    required: true,
    type: String,
  })
  description: string;

  @Prop({
    required: true,
    type: [Number],
    enum: GradeValues,
  })
  grade: (typeof GradeValues)[number][];

  @Prop({
    required: true,
    type: String,
  })
  teacher: string;

  @Prop({
    required: true,
    type: Number,
  })
  limit: number;

  @Prop({
    required: true,
    type: [String],
    enum: AfterschoolTimeValues,
  })
  time: string[];

  @Prop({
    required: true,
    type: String,
  })
  weekday: string;
}

export const AfterschoolSchema = SchemaFactory.createForClass(Afterschool);
