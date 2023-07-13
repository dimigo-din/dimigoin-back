import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GradeValues } from '../types';

export type EventDocument = Event & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Event {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  startTime: string;

  @Prop({
    required: true,
  })
  endTime: string;

  @Prop({
    required: true,
  })
  stack: string[];

  @Prop({
    required: true,
    enum: [1, 2, 3],
  })
  grade: number;

  @Prop({
    required: true,
    enum: [0, 1],
  })
  type: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
