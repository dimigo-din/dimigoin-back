import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Group {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  permissions: string[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

GroupSchema.pre<Group>('save', function (next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  next();
});
