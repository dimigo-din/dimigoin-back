import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Types } from "mongoose";

import {
  ViewPermissionGuard,
  EditPermissionGuard,
  DIMIJwtAuthGuard,
} from "src/auth/guards";
import { ObjectIdPipe } from "src/common/pipes";
import { createOpertation } from "src/common/utils";

import { Student, StudentDocument, Teacher } from "src/schemas";

import { UserManageService } from "../providers";

@ApiTags("User Manage")
@Controller("manage/user")
export class UserManageController {
  constructor(private readonly userManageService: UserManageService) {}

  @ApiOperation(
    createOpertation({
      name: "학생 목록",
      description: "모든 학생의 목록을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/student")
  async getStudents(): Promise<StudentDocument[]> {
    return await this.userManageService.getStudents();
  }

  @ApiOperation(
    createOpertation({
      name: "학생 생성",
      description: "엑셀 파일을 통해 학생을 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("/student")
  @UseInterceptors(FileInterceptor("file"))
  async uploadStudent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Student[]> {
    return await this.userManageService.uploadStudent(file);
  }

  @ApiOperation(
    createOpertation({
      name: "학생 정보",
      description: "해당하는 학생의 정보를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/student/:studentId")
  async getStudent(
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
  ): Promise<StudentDocument> {
    return await this.userManageService.getStudent(studentId);
  }

  @ApiOperation(
    createOpertation({
      name: "선생님 목록",
      description: "모든 선생님의 목록을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/teacher")
  async getTeachers(): Promise<Teacher[]> {
    return await this.userManageService.getTeachers();
  }

  @ApiOperation(
    createOpertation({
      name: "선생님 생성",
      description: "엑셀 파일을 통해 선생님을 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("/teacher")
  @UseInterceptors(FileInterceptor("file"))
  async uploadTeacher(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Teacher[]> {
    return await this.userManageService.uploadTeacher(file);
  }

  @ApiOperation(
    createOpertation({
      name: "선생님 정보",
      description: "해당하는 선생님의 정보를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/teacher/:teacherId")
  async getTeacher(
    @Param("teacherId", ObjectIdPipe) teacherId: Types.ObjectId,
  ): Promise<Teacher> {
    return await this.userManageService.getTeacher(teacherId);
  }
}
