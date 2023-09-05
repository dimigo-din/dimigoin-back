import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { StayModule } from "src/routes/stay";

import { Event, EventSchema } from "src/schemas";

import * as eventControllers from "./controllers";
import * as eventServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    StayModule,
  ],
  controllers: importToArray(eventControllers),
  providers: importToArray(eventServices),
  exports: importToArray(eventServices),
})
export class EventModule {}
