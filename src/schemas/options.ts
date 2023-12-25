import { SchemaOptions } from "@nestjs/mongoose";

export const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
  virtuals: true,
};
