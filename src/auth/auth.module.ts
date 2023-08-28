import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import {
  Student,
  StudentSchema,
  Teacher,
  TeacherSchema,
  Token,
  TokenSchema,
} from "src/schemas";
import { UserModule } from "src/routes/user/user.module";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./providers/auth.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
