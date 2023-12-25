import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

import { options } from "./options";

export type FrigoDocument = HydratedDocument<Frigo>;
@Schema(options)
export class Frigo {
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  date: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: Boolean,
  })
  current: boolean;
}

export const FrigoSchema = SchemaFactory.createForClass(Frigo);
