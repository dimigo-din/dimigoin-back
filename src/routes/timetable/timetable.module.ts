import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { Timetable, TimetableSchema } from "src/schemas";

import * as timetableControllers from "./controllers";
import * as timetableServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Timetable.name,
        schema: TimetableSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: importToArray(timetableControllers),
  providers: importToArray(timetableServices),
  exports: importToArray(timetableServices),
})
export class TimetableModule {}
