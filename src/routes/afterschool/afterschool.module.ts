import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { UserModule } from "src/routes/user";

import {
  Afterschool,
  AfterschoolSchema,
  AfterschoolApplication,
  AfterschoolApplicationSchema,
} from "src/schemas";

import * as afterschoolControllers from "./controllers";
import * as afterschoolServices from "./providers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Afterschool.name, schema: AfterschoolSchema },
      {
        name: AfterschoolApplication.name,
        schema: AfterschoolApplicationSchema,
      },
    ]),
    UserModule,
  ],
  controllers: importToArray(afterschoolControllers),
  providers: importToArray(afterschoolServices),
  exports: importToArray(afterschoolServices),
})
export class AfterschoolModule {}
