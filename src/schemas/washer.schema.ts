import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { GenderValues, GradeValues, WasherValues } from "../common";

export type WasherDocument = Washer & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Washer {
  @Prop({
    required: true,
    enum: WasherValues,
  })
  name: string;

  @Prop({
    required: true,
    type: [Number],
    enum: GradeValues,
  })
  grade: number[];

  @Prop({
    required: true,
    enum: GenderValues,
  })
  gender: string;

  @Prop({
    length: 7,
    type: [{ type: Types.ObjectId, ref: "Students", required: true }],
  })
  timetable: Types.ObjectId[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const WasherSchema = SchemaFactory.createForClass(Washer);

// 임시, save시 업데이트
WasherSchema.pre<Washer>("save", function (next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  next();
});
