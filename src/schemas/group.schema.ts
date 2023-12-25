import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

import { options } from "./options";

export type GroupDocument = HydratedDocument<Group>;
@Schema(options)
export class Group {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    type: [String],
    default: [],
  })
  permissions: [];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
