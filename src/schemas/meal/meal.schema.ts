import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

export type MealDocument = HydratedDocument<Meal>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

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
