import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TokenDocument = HydratedDocument<Token>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Token {
  @Prop({
    required: true,
  })
  refreshToken: string;

  @Prop({
    required: true,
  })
  user: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
