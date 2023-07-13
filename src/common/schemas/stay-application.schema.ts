import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StayApplicationDocument = StayApplication & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class StayApplication {
  @Prop({
    required: true,
    ref: 'Stays',
  })
  stay: Types.ObjectId;

  @Prop({
    required: true,
  })
  seat: string;

  @Prop({
    required: true,
    ref: 'Students',
  })
  user: Types.ObjectId;
}

export const StayApplicationSchema = SchemaFactory.createForClass(StayApplication);
