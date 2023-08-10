import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlaceGroupDocument = PlaceGroup & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class PlaceGroup {
  @Prop({
    required: true,
  })
  name: string;
}

export const PlaceGroupSchema = SchemaFactory.createForClass(PlaceGroup);
