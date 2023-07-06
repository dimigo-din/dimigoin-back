import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Student, StudentSchema } from 'src/common/schemas/student.schema';
import { Teacher, TeacherSchema } from 'src/common/schemas/teacher.schema';
import { Token, TokenSchema } from 'src/common/schemas/token.schema';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
