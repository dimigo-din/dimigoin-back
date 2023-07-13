import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatusValues } from '../types';

export type StayOutgoDocument = StayOutgo & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class StayOutgo {
  @Prop({
    required: true,
    ref: 'Stays',
  })
  stay: Types.ObjectId;

  @Prop({
    required: true,
    ref: 'Students',
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    enum: StatusValues,
  })
  status: string;

  @Prop({
    required: true,
  })
  date: Date;

  @Prop({
    required: true,
    type: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
  })
  duration: { start: Date; end: Date };

  @Prop({
    required: true,
    type: {
      breakfast: { type: Boolean, required: true },
      lunch: { type: Boolean, required: true },
      dinner: { type: Boolean, required: true },
    },
  })
  meal: { breakfast: boolean; lunch: boolean; dinner: boolean };

  @Prop({
    required: true,
  })
  reason: string;
}

export const StayOutgoSchema = SchemaFactory.createForClass(StayOutgo);
