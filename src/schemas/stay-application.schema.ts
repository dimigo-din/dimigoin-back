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
    type: Types.ObjectId,
    ref: "Stay",
  })
  stay: Types.ObjectId;

  @Prop({
    required: true,
  })
  seat: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  user: Types.ObjectId;

  @Prop({
    required: false,
  })
  reason: string;
}

export const StayApplicationSchema =
  SchemaFactory.createForClass(StayApplication);
