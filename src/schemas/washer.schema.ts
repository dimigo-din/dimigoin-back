import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { GenderValues, GradeValues, WasherValues } from "src/common";

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
  grade: (typeof GradeValues)[number][];

  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: (typeof GenderValues)[number];

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: "Student", required: false },
        name: { type: String, required: false },
        grade: { type: Number, required: false },
        class: { type: Number, required: false },
        number: { type: Number, required: false },
      },
    ],
  })
  timetable: {
    user?: Types.ObjectId;
    name?: string;
    grade?: number;
    class?: number;
    number?: number;
  }[];

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
