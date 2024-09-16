import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import {
  MusicList,
  MusicListSchema,
  MusicVote,
  MusicVoteSchema,
  RateLimit,
  RateLimitSchema,
  Student,
  StudentSchema,
} from "../../schemas";

import * as musicControllers from "./controllers";
import * as musicServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: MusicList.name, schema: MusicListSchema },
      { name: MusicVote.name, schema: MusicVoteSchema },
      { name: RateLimit.name, schema: RateLimitSchema },
    ]),
  ],
  controllers: importToArray(musicControllers),
  providers: importToArray(musicServices),
  exports: importToArray(musicServices),
})
export class MusicModule {}
