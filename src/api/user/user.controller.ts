import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Student, StudentDocument, Teacher } from 'src/common/schemas';
import { UserService } from './user.service';
import { myInformation } from 'src/common/types';
import {
  addGroupDto,
  CreateStudentDto,
  CreateTeacherDto,
  ResponseDto,
} from 'src/common/dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/student')
  getAllStudent(): Promise<Student[]> {
    return this.userService.getAllStudent();
  }

  @Get('/student/my')
  getMyInformation(@Req() req: Request): Promise<myInformation> {
    return this.userService.getMyInformation(req.user as StudentDocument);
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

  @Get('/superuser')
  createSuperuser(): Promise<ResponseDto> {
    return this.userService.createSuperuser();
  }
}
