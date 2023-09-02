import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { Place, PlaceGroup, PlaceGroupSchema, PlaceSchema } from "src/schemas";

import * as placeControllers from "./controllers";
import * as placeServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    MongooseModule.forFeature([
      { name: PlaceGroup.name, schema: PlaceGroupSchema },
    ]),
  ],
  controllers: importToArray(placeControllers),
  providers: importToArray(placeServices),
  exports: importToArray(placeServices),
})
export class PlaceModule {}
