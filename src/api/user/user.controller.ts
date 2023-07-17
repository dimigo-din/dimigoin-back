import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Student, StudentDocument, Teacher } from 'src/common/schemas';
import { UserService } from './user.service';
import {
  addGroupDto,
  CreateStudentDto,
  CreateTeacherDto,
  ResponseDto,
} from 'src/common/dto';
import { Request } from 'express';
import {
  ViewPermissionGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
} from 'src/common/guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ViewPermissionGuard)
  @Get('/student')
  getAllStudent(): Promise<Student[]> {
    return this.userService.getAllStudent();
  }

  @UseGuards(StudentOnlyGuard)
  @Get('/student/my')
  getMyInformation(@Req() req: Request): Promise<any> {
    return this.userService.getMyInformation(req.user as StudentDocument);
  }

  @UseGuards(ViewPermissionGuard)
  @Get('/student/:id')
  getStudent(@Param('id') studentId: string): Promise<Student> {
    return this.userService.getStudentById(studentId);
  }

  @UseGuards(ViewPermissionGuard)
  @Get('/teacher')
  getAllTeacher(): Promise<Teacher[]> {
    return this.userService.getAllTeacher();
  }

  @UseGuards(ViewPermissionGuard)
  @Get('/teacher/:id')
  getTeacher(@Param('id') teacherId: string): Promise<Teacher> {
    return this.userService.getTeacherById(teacherId);
  }

  @UseGuards(EditPermissionGuard)
  @Post('/student')
  createStudent(@Body() data: CreateStudentDto): Promise<Student> {
    return this.userService.createStudent(data);
  }

  @UseGuards(EditPermissionGuard)
  @Post('/teacher')
  createTeacher(@Body() data: CreateTeacherDto): Promise<Teacher> {
    return this.userService.createTeacher(data);
  }

  @UseGuards(EditPermissionGuard)
  @Put('/teacher/group')
  addTeacherGroup(@Body() data: addGroupDto): Promise<Teacher> {
    return this.userService.addTeacherGroup(data);
  }

  @Get('/superuser')
  createSuperuser(): Promise<ResponseDto> {
    return this.userService.createSuperuser();
  }
}
