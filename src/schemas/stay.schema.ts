import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Seats } from "../common";

export type StayDocument = Stay & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Stay {
  @Prop([
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ])
  duration: { start: string; end: string }[];

  @Prop({
    required: true,
    type: String,
  })
  start: string;

  @Prop({
    required: true,
    type: String,
  })
  end: string;

  @Prop({
    required: true,
    type: Boolean,
  })
  current: boolean;

  @Prop({
    required: true,
    type: [
      {
        date: { type: String, required: true },
        free: { type: Boolean, required: true },
      },
    ],
  })
  dates: { date: string; free: boolean }[];

  @Prop({
    required: true,
    type: Object,
  })
  seat: Seats;
}

export const StaySchema = SchemaFactory.createForClass(Stay);
