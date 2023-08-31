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
  // apply startline, endline
  @Prop({
    required: true,
    type: [[String]],
  })
  duration: string[][];

  @Prop({
    required: true,
  })
  start: string;

  @Prop({
    required: true,
  })
  end: string;

  @Prop({
    required: true,
  })
  current: boolean;

  @Prop([
    {
      date: { type: String, required: true },
      free: { type: Boolean, required: true },
    },
  ])
  dates: { date: string; free: boolean }[];

  @Prop({
    type: Object,
    required: true,
  })
  seat: Seats;
}

export const StaySchema = SchemaFactory.createForClass(Stay);
