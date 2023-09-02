import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { UserModule } from "src/routes/user";

import {
  Stay,
  StaySchema,
  StayApplication,
  StayApplicationSchema,
  StayOutgo,
  StayOutgoSchema,
} from "src/schemas";

import * as stayControllers from "./controllers";
import * as stayServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Stay.name, schema: StaySchema },
      { name: StayApplication.name, schema: StayApplicationSchema },
      { name: StayOutgo.name, schema: StayOutgoSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: importToArray(stayControllers),
  providers: importToArray(stayServices),
  exports: importToArray(stayServices),
})
export class StayModule {}
