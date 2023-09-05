import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { StayModule } from "src/routes/stay";

import {
  Laundry,
  LaundrySchema,
  LaundryTimetable,
  LaundryTimetableSchema,
  LaundryApplication,
  LaundryApplicationSchema,
} from "src/schemas";

import * as laundryControllers from "./controllers";
import * as laundryServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Laundry.name, schema: LaundrySchema },
      { name: LaundryTimetable.name, schema: LaundryTimetableSchema },
      {
        name: LaundryApplication.name,
        schema: LaundryApplicationSchema,
      },
    ]),
    StayModule,
  ],
  controllers: importToArray(laundryControllers),
  providers: importToArray(laundryServices),
  exports: importToArray(laundryServices),
})
export class LaundryModule {}
