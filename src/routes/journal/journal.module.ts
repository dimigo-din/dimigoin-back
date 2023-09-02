import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import importToArray from "import-to-array";

import { Journal, JournalSchema } from "src/schemas";

import * as journalControllers from "./controllers";
import * as journalServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
    PassportModule,
  ],
  controllers: importToArray(journalControllers),
  providers: importToArray(journalServices),
  exports: importToArray(journalServices),
})
export class JournalModule {}
