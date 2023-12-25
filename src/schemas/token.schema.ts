import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { options } from "./options";

export type TokenDocument = HydratedDocument<Token>;
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
