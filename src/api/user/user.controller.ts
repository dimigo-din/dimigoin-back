import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Student, StudentDocument, Teacher } from 'src/common/schemas';
import { UserService } from './user.service';
import {
  CreateStudentDto,
  CreateTeacherDto,
  ManageTeacherGroupDto,
  ResponseDto,
} from 'src/common/dto';
import { Request } from 'express';
import {
  ViewPermissionGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
} from 'src/common/guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Student
  @UseGuards(ViewPermissionGuard)
  @Get('/student')
  getAllStudent(): Promise<Student[]> {
    return this.userService.getAllStudent();
  }

  @Post('/student')
  createStudent(@Body() data: CreateStudentDto): Promise<Student> {
    return this.userService.createStudent(data);
  }

  @Post('/student/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadStudent(@UploadedFile() file: Express.Multer.File): Promise<ResponseDto> {
    return this.userService.uploadStudent(file);
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

  // Teacher
  @UseGuards(ViewPermissionGuard)
  @Get('/teacher')
  getAllTeacher(): Promise<Teacher[]> {
    return this.userService.getAllTeacher();
  }

  @UseGuards(EditPermissionGuard)
  @Post('/teacher')
  createTeacher(@Body() data: CreateTeacherDto): Promise<Teacher> {
    return this.userService.createTeacher(data);
  }

  @UseGuards(EditPermissionGuard)
  @Post('/teacher/upload')
  @UseInterceptors(FileInterceptor('file'))
  createTeacherByFile(@UploadedFile() file: Express.Multer.File): Promise<Teacher[]> {
    return this.userService.createTeacherByFile(file);
  }

  @UseGuards(ViewPermissionGuard)
  @Get('/teacher/:id')
  getTeacher(@Param('id') teacherId: string): Promise<Teacher> {
    return this.userService.getTeacherById(teacherId);
  }

  @UseGuards(EditPermissionGuard)
  @Post('/teacher/group')
  manageTeacherGroup(@Body() data: ManageTeacherGroupDto): Promise<Teacher> {
    return this.userService.manageTeacherGroup(data);
  }

  @Get('/superuser')
  createSuperuser(): Promise<ResponseDto> {
    return this.userService.createSuperuser();
  }
}
