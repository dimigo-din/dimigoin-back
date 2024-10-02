import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

import { RateLimitTypeValues } from "src/lib";

import { Student } from "../user/student.schema";

@Schema({ timestamps: false, versionKey: false })
export class RateLimit {
  @Prop({
    required: true,
    type: String,
    enum: RateLimitTypeValues,
  })
  type: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Student.name,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
  })
  time: number;
}

export const RateLimitSchema = SchemaFactory.createForClass(RateLimit);
export type RateLimitDocument = HydratedDocument<RateLimit>;
export const RateLimitPopulator = RateLimit.name.toLowerCase();
