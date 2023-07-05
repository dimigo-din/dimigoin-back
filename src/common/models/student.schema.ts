import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
    required: true,
  })
  grade: number;

  @Prop({
    required: true,
  })
  class: number;

  @Prop({
    required: true,
  })
  number: number;

  @Prop({
    required: true,
    enum: ['M', 'F'],
  })
  gender: string;

  @Prop({
    required: true,
  })
  birthday: Date;

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
