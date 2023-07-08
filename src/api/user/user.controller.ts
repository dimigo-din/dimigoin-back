import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Student, Teacher } from 'src/common/schemas';
import { UserService } from './user.service';
import {
  addGroupDto,
  CreateStudentDto,
  CreateTeacherDto,
} from 'src/common/dto';
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
    return this.userService.getStudentById(studentId);
  }

  @Get('/teacher')
  getAllTeacher(): Promise<Teacher[]> {
    return this.userService.getAllTeacher();
  }

  @Get('/teacher/:id')
  getTeacher(@Param('id') teacherId: string): Promise<Teacher> {
    return this.userService.getTeacherById(teacherId);
  }

  @Post('/student')
  createStudent(@Body() data: CreateStudentDto): Promise<Student> {
    return this.userService.createStudent(data);
  }

  @Post('/teacher')
  createTeacher(@Body() data: CreateTeacherDto): Promise<Teacher> {
    return this.userService.createTeacher(data);
  }

  @Put('/teacher/group')
  addTeacherGroup(@Body() data: addGroupDto): Promise<Teacher> {
    return this.userService.addTeacherGroup(data);
  }
}
