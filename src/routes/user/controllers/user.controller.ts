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
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import {
  ViewPermissionGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
  DIMIJwtAuthGuard,
} from "src/auth/guards";
import { ResponseDto } from "src/common/dto";

import { StudentDocument, Teacher } from "src/schemas";

import { ManageTeacherGroupDto } from "../dto";
import { UserService } from "../providers";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Student
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/student")
  async getAllStudent(): Promise<StudentDocument[]> {
    return await this.userService.getAllStudent();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Post("/student/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadStudent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.userService.uploadStudent(file);
  }

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Get("/student/my")
  async getMyInformation(@Req() req: Request): Promise<any> {
    return await this.userService.getMyInformation(req.user as StudentDocument);
  }

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/student/:id")
  async getStudent(@Param("id") studentId: string): Promise<StudentDocument> {
    return await this.userService.getStudentById(studentId);
  }

  // Teacher
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/teacher")
  async getAllTeacher(): Promise<Teacher[]> {
    return await this.userService.getAllTeacher();
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("/teacher/upload")
  @UseInterceptors(FileInterceptor("file"))
  async createTeacherByFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Teacher[]> {
    return await this.userService.createTeacherByFile(file);
  }

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/teacher/:id")
  async getTeacher(@Param("id") teacherId: string): Promise<Teacher> {
    return await this.userService.getTeacherById(teacherId);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
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
