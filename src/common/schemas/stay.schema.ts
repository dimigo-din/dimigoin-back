import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StayDocument = Stay & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Stay {
  @Prop({
    required: true,
  })
  start: Date;

  @Prop({
    required: true,
  })
  end: Date;

  @Prop({
    required: true,
  })
  current: boolean;

  @Prop([
    {
      date: { type: Date, required: true },
      outgo: { type: Boolean, required: true },
    },
  ])
  dates: { date: Date; outgo: boolean }[];
}

export const StaySchema = SchemaFactory.createForClass(Stay);
