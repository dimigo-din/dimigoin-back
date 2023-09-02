import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "src/routes/user/user.module";

import { DIMIConfigModule, DIMIJWTModule } from "src/common";

import {
  Student,
  StudentSchema,
  Teacher,
  TeacherSchema,
  Token,
  TokenSchema,
} from "src/schemas";

import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./providers/auth.service";
import { DIMIJwtStrategy } from "./strategies";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    UserModule,
    DIMIConfigModule,
    DIMIJWTModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, DIMIJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
