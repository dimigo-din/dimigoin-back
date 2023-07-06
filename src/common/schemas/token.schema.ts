import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Token {
  @Prop({
    required: true,
  })
  refreshToken: string;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.pre<Token>('save', function (next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  next();
});
