import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { SeatValues, Seat } from "src/common";

export type StayDocument = HydratedDocument<Stay>;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};

@Schema(options)
class StayDuration {
  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  start: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  end: string;
}
const StayDurationSchema = SchemaFactory.createForClass(StayDuration);

@Schema(options)
class StayDates {
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
  free: boolean;
}
const StayDatesSchema = SchemaFactory.createForClass(StayDates);

@Schema(options)
class StaySeat {
  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    enum: SeatValues,
  })
  M1: Seat;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    enum: SeatValues,
  })
  M2: Seat;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    enum: SeatValues,
  })
  M3: Seat;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    enum: SeatValues,
  })
  F1: Seat;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    enum: SeatValues,
  })
  F2: Seat;

  @ApiProperty()
  @Prop({
    required: true,
    type: [String],
    enum: SeatValues,
  })
  F3: Seat;
}
const StaySeatSchema = SchemaFactory.createForClass(StaySeat);

@Schema(options)
export class Stay {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    type: [StayDuration],
  })
  @Prop({
    required: true,
    type: [StayDurationSchema],
  })
  duration: StayDuration[];

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  start: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  end: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: Boolean,
  })
  current: boolean;

  @ApiProperty({
    type: [StayDates],
  })
  @Prop({
    required: true,
    type: [StayDatesSchema],
  })
  dates: StayDates[];

  @ApiProperty({
    type: StaySeat,
  })
  @Prop({
    required: true,
    type: StaySeatSchema,
  })
  seat: StaySeat;
}

export const StaySchema = SchemaFactory.createForClass(Stay);
