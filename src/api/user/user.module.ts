import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/common/schemas';
import { Student, StudentSchema } from 'src/common/schemas/student.schema';
import { Teacher, TeacherSchema } from 'src/common/schemas/teacher.schema';
import { AuthModule } from '../auth/auth.module';
import { FrigoModule } from '../frigo/frigo.module';
import { LaundryModule } from '../laundry/laundry.module';
import { StayModule } from '../stay/stay.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    LaundryModule,
    StayModule,
    FrigoModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
