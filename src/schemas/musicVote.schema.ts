import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

import { MusicList } from "./musicList.schema";
import { Student } from "./student.schema";

@Schema({ timestamps: false, versionKey: false })
export class MusicVote {
  @Prop({
    required: true,
    type: String,
  })
  week: string;
  @Prop({
    required: true,
    type: String,
  })
  day: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Student.name,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: MusicList.name,
  })
  target: Types.ObjectId;

  @Prop({
    required: true,
    type: Boolean,
  })
  isUpVote: boolean;
}

export const MusicVoteSchema = SchemaFactory.createForClass(MusicVote);
export type MusicVoteDocument = HydratedDocument<MusicVote>;
export const MusicVotePopulator = MusicVote.name.toLowerCase();
