import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Student, Teacher } from 'src/common/schemas';
import { UserService } from './user.service';
import { CreateStudentDto } from 'src/common/dto';
// import { Request } from 'express';
// import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/student')
  getAllStudent(): Promise<Student[]> {
    return this.userService.getAllStudent();
  }

  @Get('/student/:id')
  getStudent(@Param('id') studentId: string): Promise<Student> {
    return this.userService.getStudent(studentId);
  }

  @Get('/teacher')
  getAllTeacher(): Promise<Teacher[]> {
    return this.userService.getAllTeacher();
  }

  @Post('/student')
  createStudent(@Body() data: CreateStudentDto): Promise<Student> {
    return this.userService.createStudent(data);
  }
}
