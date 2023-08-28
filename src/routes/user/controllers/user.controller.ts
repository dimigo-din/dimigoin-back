import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Student, StudentDocument, Teacher } from "src/schemas";
import { UserService } from "../providers/user.service";
import { CreateStudentDto } from "../dto/student.dto";
import { CreateTeacherDto, ManageTeacherGroupDto } from "../dto/teacher.dto";
import { ResponseDto } from "src/common/dto";
import { Request } from "express";
import {
  ViewPermissionGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
} from "src/auth/guards";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Student
  @UseGuards(ViewPermissionGuard)
  @Get("/student")
  async getAllStudent(): Promise<Student[]> {
    return await this.userService.getAllStudent();
  }

  @Post("/student")
  async createStudent(@Body() data: CreateStudentDto): Promise<Student> {
    return await this.userService.createStudent(data);
  }

  @Post("/student/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadStudent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.userService.uploadStudent(file);
  }

  @UseGuards(StudentOnlyGuard)
  @Get("/student/my")
  async getMyInformation(@Req() req: Request): Promise<any> {
    return await this.userService.getMyInformation(req.user as StudentDocument);
  }

  @UseGuards(ViewPermissionGuard)
  @Get("/student/:id")
  async getStudent(@Param("id") studentId: string): Promise<Student> {
    return await this.userService.getStudentById(studentId);
  }

  // Teacher
  @UseGuards(ViewPermissionGuard)
  @Get("/teacher")
  async getAllTeacher(): Promise<Teacher[]> {
    return await this.userService.getAllTeacher();
  }

  @UseGuards(EditPermissionGuard)
  @Post("/teacher")
  async createTeacher(@Body() data: CreateTeacherDto): Promise<Teacher> {
    return await this.userService.createTeacher(data);
  }

  @UseGuards(EditPermissionGuard)
  @Post("/teacher/upload")
  @UseInterceptors(FileInterceptor("file"))
  async createTeacherByFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Teacher[]> {
    return await this.userService.createTeacherByFile(file);
  }

  @UseGuards(ViewPermissionGuard)
  @Get("/teacher/:id")
  async getTeacher(@Param("id") teacherId: string): Promise<Teacher> {
    return await this.userService.getTeacherById(teacherId);
  }

  @UseGuards(EditPermissionGuard)
  @Post("/teacher/group")
  async manageTeacherGroup(
    @Body() data: ManageTeacherGroupDto,
  ): Promise<Teacher> {
    return await this.userService.manageTeacherGroup(data);
  }

  @Get("/superuser")
  async createSuperuser(): Promise<ResponseDto> {
    return await this.userService.createSuperuser();
  }
}
