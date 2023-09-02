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
  })
  id: number;

  @Prop({
    required: true,
  })
  date: string;

  @Prop({
    required: true,
  })
  breakfast: string;

  @Prop({
    required: true,
  })
  lunch: string;

  @Prop({
    required: true,
  })
  dinner: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
