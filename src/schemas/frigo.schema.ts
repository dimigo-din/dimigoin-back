import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ClassValues, GradeValues, StatusValues } from "../common";

export type FrigoDocument = Frigo & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Frigo {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    enum: GradeValues,
  })
  grade: number;

  @Prop({
    required: true,
    enum: ClassValues,
  })
  class: number;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Students",
  })
  id: Types.ObjectId;

  @Prop({
    required: true,
  })
  reason: string;

  @Prop({
    required: true,
    enum: StatusValues,
  })
  status: string;
}

export const FrigoSchema = SchemaFactory.createForClass(Frigo);
