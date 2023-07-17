import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JournalDocument = Journal & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Journal {
  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  date: Date;

  @Prop({
    required: true,
    ref: 'Students',
  })
  user: Types.ObjectId;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
