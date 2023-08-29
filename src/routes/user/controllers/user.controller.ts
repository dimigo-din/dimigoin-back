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
import { ManageTeacherGroupDto } from "../dto/teacher.dto";
import { ResponseDto } from "src/common/dto";
import { Request } from "express";
import {
  ViewPermissionGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
} from "src/auth/guards";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Student
  @UseGuards(AuthGuard("jwt"), ViewPermissionGuard)
  @Get("/student")
  async getAllStudent(): Promise<StudentDocument[]> {
    return await this.userService.getAllStudent();
  }

  @Post("/student/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadStudent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.userService.uploadStudent(file);
  }

  @UseGuards(AuthGuard("jwt"), StudentOnlyGuard)
  @Get("/student/my")
  async getMyInformation(@Req() req: Request): Promise<any> {
    return await this.userService.getMyInformation(req.user as StudentDocument);
  }

  @UseGuards(AuthGuard("jwt"), ViewPermissionGuard)
  @Get("/student/:id")
  async getStudent(@Param("id") studentId: string): Promise<StudentDocument> {
    return await this.userService.getStudentById(studentId);
  }

  // Teacher
  @UseGuards(AuthGuard("jwt"), ViewPermissionGuard)
  @Get("/teacher")
  async getAllTeacher(): Promise<Teacher[]> {
    return await this.userService.getAllTeacher();
  }

  @UseGuards(AuthGuard("jwt"), EditPermissionGuard)
  @Post("/teacher/upload")
  @UseInterceptors(FileInterceptor("file"))
  async createTeacherByFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Teacher[]> {
    return await this.userService.createTeacherByFile(file);
  }

  @UseGuards(AuthGuard("jwt"), ViewPermissionGuard)
  @Get("/teacher/:id")
  async getTeacher(@Param("id") teacherId: string): Promise<Teacher> {
    return await this.userService.getTeacherById(teacherId);
  }

  @UseGuards(AuthGuard("jwt"), EditPermissionGuard)
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
