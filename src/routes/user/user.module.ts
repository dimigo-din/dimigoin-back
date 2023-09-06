import { Global, Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import importToArray from "import-to-array";

import { FrigoModule } from "src/routes/frigo";
import { LaundryModule } from "src/routes/laundry";
import { StayModule } from "src/routes/stay";

import {
  Group,
  GroupSchema,
  Student,
  StudentSchema,
  Teacher,
  TeacherSchema,
} from "src/schemas";

import * as userControllers from "./controllers";
import * as userServices from "./providers";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    forwardRef(() => StayModule),
    forwardRef(() => FrigoModule),
    forwardRef(() => LaundryModule),
  ],
  controllers: importToArray(userControllers),
  providers: importToArray(userServices),
  exports: importToArray(userServices),
})
export class UserModule {}
