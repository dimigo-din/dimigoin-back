import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MealDocument = Meal & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Meal {
  @Prop({
    required: true,
    type: Number,
  })
  id: number;

  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @Prop({
    required: true,
    type: String,
  })
  breakfast: string;

  @Prop({
    required: true,
    type: String,
  })
  lunch: string;

  @Prop({
    required: true,
    type: String,
  })
  dinner: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
