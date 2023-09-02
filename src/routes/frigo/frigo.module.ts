import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { Frigo, FrigoSchema } from "src/schemas";

import * as frigoControllers from "./controllers";
import * as frigoServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Frigo.name, schema: FrigoSchema }]),
  ],
  controllers: importToArray(frigoControllers),
  providers: importToArray(frigoServices),
  exports: importToArray(frigoServices),
})
export class FrigoModule {}
