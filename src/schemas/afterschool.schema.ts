import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import {
  GradeValues,
  AfterschoolTimeValues,
  Grade,
  AfterschoolTime,
} from "src/common/types";

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
  grade: Grade[];

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
  time: AfterschoolTime[];

  @Prop({
    required: true,
    type: String,
  })
  day: string;
}

export const AfterschoolSchema = SchemaFactory.createForClass(Afterschool);
