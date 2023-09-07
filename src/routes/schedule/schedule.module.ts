import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { Schedule, ScheduleSchema } from "src/schemas";

import * as scheduleControllers from "./controllers";
import * as scheduleServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    HttpModule,
  ],
  controllers: importToArray(scheduleControllers),
  providers: importToArray(scheduleServices),
  exports: importToArray(scheduleServices),
})
export class ScheduleModule {}
