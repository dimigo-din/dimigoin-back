import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { GenderValues, PositionValues } from "src/common";
export type LaundryDocument = Laundry & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Laundry {
  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: (typeof GenderValues)[number];

  @Prop({
    required: true,
    type: Number,
  })
  floor: number;

  @Prop({
    required: true,
    type: String,
    enum: PositionValues,
  })
  position: (typeof PositionValues)[number];
}

export const LaundrySchema = SchemaFactory.createForClass(Laundry);
