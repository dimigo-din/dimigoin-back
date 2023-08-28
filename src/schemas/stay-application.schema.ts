import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type StayApplicationDocument = StayApplication & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class StayApplication {
  @Prop({
    required: true,
    ref: "Stays",
  })
  stay: Types.ObjectId;

  @Prop({
    required: true,
  })
  seat: string;

  @Prop({
    required: true,
    ref: "Students",
  })
  user: Types.ObjectId;

  // 좌석 미선택 사유
  @Prop({
    required: false,
  })
  reason: string;
}

export const StayApplicationSchema =
  SchemaFactory.createForClass(StayApplication);
