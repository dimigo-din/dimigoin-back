import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AfterschoolTimeValues, ClassValues, GradeValues } from '../types';

export type AfterschoolDocument = Afterschool & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Afterschool {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  subject: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
    type: [Number],
    enum: GradeValues,
  })
  grade: number[];

  @Prop({
    required: true,
    type: [Number],
    enum: ClassValues,
  })
  class: number[];

  @Prop({
    required: true,
  })
  teacher: string;

  @Prop({
    required: true,
  })
  limit: number;

  @Prop({
    required: true,
    type: [String],
  })
  time: string[];

  @Prop({
    required: true,
  })
  weekday: string;
}

export const AfterschoolSchema = SchemaFactory.createForClass(Afterschool);
