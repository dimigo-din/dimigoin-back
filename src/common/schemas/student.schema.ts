import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClassValues, GenderValues, GradeValues, Permissions } from '../types';

export type StudentDocument = Student & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Student {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  id: string;

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
  number: number;

  @Prop({
    required: true,
    enum: GenderValues,
  })
  gender: string;

  @Prop({
    type: Object,
    default: { view: [], edit: [] },
  })
  permissions: Permissions;

  @Prop({
    type: Types.ObjectId,
    ref: 'Groups',
  })
  groups: Types.ObjectId[];

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// 임시, save시 업데이트
StudentSchema.pre<Student>('save', function (next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  next();
});
