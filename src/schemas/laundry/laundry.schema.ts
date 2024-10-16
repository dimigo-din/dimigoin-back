import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

import {
  GenderValues,
  PositionValues,
  GenderType,
  PositionType,
  LaundryValues,
  LaundryType,
} from "src/lib";
export type LaundryDocument = HydratedDocument<Laundry>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

@Schema(options)
export class Laundry {
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: LaundryValues,
  })
  laundryType: LaundryType;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: GenderType;

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
  })
  floor: number;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: PositionValues,
  })
  position: PositionType;
}

export const LaundrySchema = SchemaFactory.createForClass(Laundry);
