import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { StayModule } from "src/routes/stay";

import { Washer, WasherSchema } from "src/schemas";

import * as laundryControllers from "./controllers";
import * as laundryServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Washer.name, schema: WasherSchema }]),
    StayModule,
  ],
  controllers: importToArray(laundryControllers),
  providers: importToArray(laundryServices),
  exports: importToArray(laundryServices),
})
export class LaundryModule {}
