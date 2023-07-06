import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Student, StudentSchema } from 'src/common/schemas/student.schema';
import { Teacher, TeacherSchema } from 'src/common/schemas/teacher.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
