import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import {
  GradeValues,
  AfterschoolTimeValues,
  Grade,
  AfterschoolTime,
} from "src/common/types";

import { options } from "./options";

export type AfterschoolDocument = HydratedDocument<Afterschool>;
@Schema(options)
export class Afterschool {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  subject: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  description: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: [Number],
    enum: GradeValues,
  })
  grade: Grade[];

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  teacher: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
  })
  limit: number;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    enum: AfterschoolTimeValues,
  })
  time: AfterschoolTime[];

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  day: string;
}

export const AfterschoolSchema = SchemaFactory.createForClass(Afterschool);
