import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import {
  Frigo,
  FrigoSchema,
  FrigoApplication,
  FrigoApplicationSchema,
} from "src/schemas";

import * as frigoControllers from "./controllers";
import * as frigoServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Frigo.name, schema: FrigoSchema }]),
    MongooseModule.forFeature([
      { name: FrigoApplication.name, schema: FrigoApplicationSchema },
    ]),
  ],
  controllers: importToArray(frigoControllers),
  providers: importToArray(frigoServices),
  exports: importToArray(frigoServices),
})
export class FrigoModule {}
