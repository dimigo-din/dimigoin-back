import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { ClassValues, GradeValues } from "src/common";

export type LocationDocument = Location & Document;

const options: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};

@Schema(options)
export class Location {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Student",
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: Number,
    enum: GradeValues,
  })
  grade: (typeof GradeValues)[number];

  @Prop({
    required: true,
    type: Number,
    enum: ClassValues,
  })
  class: (typeof ClassValues)[number];

  @Prop({
    required: true,
    type: String,
  })
  placeName: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "Place",
  })
  place: Types.ObjectId;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
