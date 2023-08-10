import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClassValues, GradeValues } from '../types';

export type LocationDocument = Location & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Location {
  @Prop({
    required: true,
    ref: 'Students',
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    enum: GradeValues,
  })
  grade: number;

  @Prop({
    required: true,
    enum: ClassValues,
  })
  class: number;

  @Prop({
    required: true,
  })
  placeName: string;

  @Prop({
    required: true,
    ref: 'Places',
  })
  place: Types.ObjectId;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
