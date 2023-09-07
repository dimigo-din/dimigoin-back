import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { StatusValues, Status } from "src/common";

export type StayOutgoDocument = StayOutgo & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class StayOutgo {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Stay",
  })
  stay: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Types.ObjectId;

  @Prop({
    required: true,
    type: Boolean,
  })
  free: boolean;

  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @Prop({
    required: false,
    type: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  })
  duration: { start: string; end: string };

  @Prop({
    required: true,
    type: {
      breakfast: { type: Boolean, required: true },
      lunch: { type: Boolean, required: true },
      dinner: { type: Boolean, required: true },
    },
  })
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };

  @Prop({
    required: false,
    type: String,
  })
  reason: string;

  @Prop({
    required: true,
    type: String,
    enum: StatusValues,
  })
  status: Status;
}

export const StayOutgoSchema = SchemaFactory.createForClass(StayOutgo);
