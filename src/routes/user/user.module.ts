import { forwardRef, Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Group,
  GroupSchema,
  Student,
  StudentSchema,
  Teacher,
  TeacherSchema,
} from "src/schemas";
import { FrigoModule } from "../frigo/frigo.module";
import { LaundryModule } from "../laundry/laundry.module";
import { StayModule } from "../stay/stay.module";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./providers/user.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    forwardRef(() => StayModule),
    LaundryModule,
    FrigoModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
