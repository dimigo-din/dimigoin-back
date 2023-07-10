import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Permissions } from '../types';

export type TeacherDocument = Teacher & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Teacher {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  id: string;

  @Prop({
    required: true,
  })
  password_salt: string;

  @Prop({
    required: true,
  })
  password_hash: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Groups',
  })
  groups: Types.ObjectId[];

  @Prop({
    type: Object,
    default: { view: [], edit: [] },
  })
  permissions: Permissions;

  // TBD: class-validation 고치면 테스트하기
  @Prop({
    required: true,
    type: [String],
    enum: ['A', 'T', 'D'],
  })
  positions: string[];

  @Prop({
    required: true,
    enum: ['M', 'F'],
  })
  gender: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

TeacherSchema.pre<Teacher>('save', function (next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  next();
});
