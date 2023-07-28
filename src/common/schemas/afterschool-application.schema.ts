import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GradeValues } from '../types';

export type AfterschoolApplicationDocument = AfterschoolApplication & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class AfterschoolApplication {
  @Prop({
    ref: 'Students',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    enum: GradeValues,
  })
  grade: number;

  @Prop({
    ref: 'Afterschools',
    required: false,
  })
  afterschool: Types.ObjectId;
}

export const AfterschoolApplicationSchema = SchemaFactory.createForClass(
  AfterschoolApplication,
);
