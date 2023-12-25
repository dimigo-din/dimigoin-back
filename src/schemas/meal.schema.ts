import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { options } from "./options";

export type MealDocument = HydratedDocument<Meal>;
@Schema(options)
export class Meal {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
  })
  id: number;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  breakfast: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  lunch: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  dinner: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
