import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Types } from "mongoose";

import {
  EditPermissionGuard,
  ViewPermissionGuard,
  DIMIJwtAuthGuard,
} from "src/auth/guards";
import { ObjectIdPipe } from "src/common/pipes";
import { createOpertation } from "src/common/utils";

import { Stay, StayApplication } from "src/schemas";

import { ApplyStayDto, CreateStayDto } from "../dto";
import { StayManageService } from "../providers";

@ApiTags("Stay Manage")
@Controller("manage/stay")
export class StayManageController {
  constructor(private readonly stayManageService: StayManageService) {}

  @ApiOperation(
    createOpertation({
      name: "잔류 정보",
      description: "모든 잔류 정보를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get()
  async getAllStay(): Promise<Stay[]> {
    return await this.stayManageService.getAll();
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 정보",
      description: "잔류를 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post()
  async createStay(@Body() data: CreateStayDto): Promise<Stay> {
    return await this.stayManageService.create(data);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 정보",
      description: "특정 잔류 정보를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/:id")
  async getStayInfo(
    @Param("id", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<{
    stay: Stay;
    applications: StayApplication[];
  }> {
    const stay = await this.stayManageService.get(stayId);
    const applications = await this.stayManageService.getApplications(stayId);
    return {
      stay,
      applications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 삭제",
      description: "잔류를 삭제합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("/:id")
  async deleteStay(
    @Param("id", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<Stay> {
    return await this.stayManageService.delete(stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 학생 추가",
      description: "학생 잔류 신청을 추가합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("student/:id")
  async applyStudent(
    @Param("id", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() data: ApplyStayDto,
  ): Promise<StayApplication> {
    return await this.stayManageService.applyStudent(studentId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 학생 삭제",
      description: "학생 잔류 신청을 삭제합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("student/:id")
  async cancelStudent(
    @Param("id", ObjectIdPipe) studentId: Types.ObjectId,
  ): Promise<StayApplication> {
    return await this.stayManageService.cancelStudent(studentId);
  }
}
