import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { StayModule } from "src/routes/stay";
import { UserModule } from "src/routes/user";

import {
  Laundry,
  LaundrySchema,
  LaundryTimetable,
  LaundryTimetableSchema,
} from "src/schemas";

import * as laundryControllers from "./controllers";
import * as laundryServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Laundry.name, schema: LaundrySchema },
      { name: LaundryTimetable.name, schema: LaundryTimetableSchema },
    ]),
    forwardRef(() => UserModule),
    StayModule,
  ],
  controllers: importToArray(laundryControllers),
  providers: importToArray(laundryServices),
  exports: importToArray(laundryServices),
})
export class LaundryModule {}
