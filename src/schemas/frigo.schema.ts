import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FrigoDocument = Frigo & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Frigo {
  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @Prop({
    required: true,
    type: Boolean,
  })
  current: boolean;
}

export const FrigoSchema = SchemaFactory.createForClass(Frigo);
