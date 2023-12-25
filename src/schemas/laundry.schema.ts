import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

import { GenderValues, PositionValues, Gender, Position } from "src/common";

import { options } from "./options";

export type LaundryDocument = HydratedDocument<Laundry>;
@Schema(options)
export class Laundry {
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
    enum: GenderValues,
  })
  gender: Gender;

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
  position: Position;
}

export const LaundrySchema = SchemaFactory.createForClass(Laundry);
