import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { SeatValues } from "src/common/types";

export type StayApplicationDocument = StayApplication & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class StayApplication {
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
    type: String,
    enum: SeatValues,
  })
  seat: (typeof SeatValues)[number];

  @Prop({
    required: false,
    type: String,
  })
  reason: string;
}

export const StayApplicationSchema =
  SchemaFactory.createForClass(StayApplication);
