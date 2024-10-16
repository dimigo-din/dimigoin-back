import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { type HydratedDocument, Types } from "mongoose";

import { Gender, GenderValues } from "../common";

import { Student } from "./student.schema";

@Schema({ timestamps: false, versionKey: false })
export class MusicList {
  @Prop({
    required: true,
    type: String,
  })
  day: string;

  @Prop({
    required: true,
    type: String,
  })
  week: string;

  @Prop({
    required: true,
    type: String,
  })
  videoId: string;

  @Prop({
    required: true,
    type: GenderValues,
  })
  gender: Gender;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Student.name,
  })
  user: Types.ObjectId;

  @Prop({
    required: false,
    type: String,
  })
  selectedDate: string; // historize selected date yyyyddd
}

export const MusicListSchema = SchemaFactory.createForClass(MusicList);
export type MusicListDocument = HydratedDocument<MusicList>;
export const MusicListPopulator = MusicList.name.toLowerCase();
