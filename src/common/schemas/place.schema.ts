import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlaceDocument = Place & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Place {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    ref: 'PlaceGroups',
  })
  group: Types.ObjectId;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
