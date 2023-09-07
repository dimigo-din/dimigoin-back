import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { StatusValues, Status } from "src/common";

export type FrigoApplicationDocument = FrigoApplication & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class FrigoApplication {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Frigo",
  })
  frigo: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  student: Types.ObjectId;

  @Prop({
    required: true,
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

export const FrigoApplicationSchema =
  SchemaFactory.createForClass(FrigoApplication);
