import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { Group, GroupSchema } from "src/schemas";

import * as groupControllers from "./controllers";
import * as groupServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
  ],
  controllers: importToArray(groupControllers),
  providers: importToArray(groupServices),
  exports: importToArray(groupServices),
})
export class GroupModule {}
