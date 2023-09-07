import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { SeatValues, Seat } from "src/common";

export type StayDocument = Stay & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Stay {
  @Prop({
    required: true,
    type: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  })
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
    type: {
      M1: { required: true, type: [String], enum: SeatValues },
      M2: { required: true, type: [String], enum: SeatValues },
      M3: { required: true, type: [String], enum: SeatValues },
      F1: { required: true, type: [String], enum: SeatValues },
      F2: { required: true, type: [String], enum: SeatValues },
      F3: { required: true, type: [String], enum: SeatValues },
    },
  })
  seat: {
    M1: Seat;
    M2: Seat;
    M3: Seat;
    F1: Seat;
    F2: Seat;
    F3: Seat;
  };
}

export const StaySchema = SchemaFactory.createForClass(Stay);
