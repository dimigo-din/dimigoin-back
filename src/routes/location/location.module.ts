import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { Place, PlaceSchema, Location, LocationSchema } from "src/schemas";

import { StayModule } from "../stay/stay.module";

import * as locationControllers from "./controllers";
import * as locationServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    StayModule,
  ],
  controllers: importToArray(locationControllers),
  providers: importToArray(locationServices),
  exports: importToArray(locationServices),
})
export class LocationModule {}
