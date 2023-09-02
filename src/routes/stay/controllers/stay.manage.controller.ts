import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Patch,
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

import { Stay, StayApplication, StayOutgoDocument } from "src/schemas";

import { ApplyStayDto, CreateStayDto, ApplyStayOutgoDto } from "../dto";
import { StayManageService } from "../providers";

@ApiTags("Stay Manage")
@Controller("manage/stay")
export class StayManageController {
  constructor(private readonly stayManageService: StayManageService) {}

  @ApiOperation(
    createOpertation({
      name: "잔류 리스트",
      description: "모든 잔류를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get()
  async getAllStay(): Promise<Stay[]> {
    return await this.stayManageService.getAll();
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 생성",
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
      name: "현재 잔류 정보",
      description:
        "현재 활성화 되어있는 잔류 정보와 잔류 신청자 목록을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/current")
  async getCurrentStay(): Promise<{
    stay: Stay;
    applications: StayApplication[];
  }> {
    const stayId = await this.stayManageService.getCurrentId();

    const stay = await this.stayManageService.get(stayId);
    const applications = await this.stayManageService.getApplications(stayId);

    return {
      stay,
      applications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "현재 잔류 설정",
      description: "해당 잔류를 활성화 합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Patch("/current/:stayId")
  async setCurrentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<Stay> {
    return await this.stayManageService.setCurrent(stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "현재 잔류 해제",
      description: "해당 잔류를 비활성화 합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Delete("/current/:stayId")
  async deleteCurrentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<Stay> {
    return await this.stayManageService.deleteCurrent(stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 정보",
      description: "해당 잔류 정보와 잔류 신청자 목록을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/:stayId")
  async getStayInfo(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
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
      name: "잔류 수정",
      description: "해당 잔류 정보를 수정합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Put("/:stayId")
  async editStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Body() data: CreateStayDto,
  ): Promise<Stay> {
    return await this.stayManageService.edit(stayId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 삭제",
      description: "해당 잔류를 삭제합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("/:stayId")
  async deleteStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
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
  @Post("/:stayId/:studentId")
  async applyStudentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() data: ApplyStayDto,
  ): Promise<StayApplication> {
    return await this.stayManageService.applyStudent(studentId, stayId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 학생 삭제",
      description: "학생 잔류 신청을 삭제합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("/:stayId/:studentId")
  async cancelStudentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
  ): Promise<StayApplication> {
    return await this.stayManageService.cancelStudent(studentId, stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류외출 학생 추가",
      description: "학생 잔류외출 신청을 추가합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("/outgo/:stayId/:studentId")
  async applyStudentStayOutgo(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() data: ApplyStayOutgoDto,
  ): Promise<StayOutgoDocument> {
    return await this.stayManageService.applyStudentOutgo(
      studentId,
      stayId,
      data,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "잔류외출 학생 삭제",
      description: "학생 잔류외출 신청을 삭제합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("/outgo/:stayId/:studentId/:outgoId")
  async cancelStudentStayOutgo(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Param("outgoId", ObjectIdPipe) outgoId: Types.ObjectId,
  ): Promise<StayOutgoDocument> {
    return await this.stayManageService.cancelStudentOutgo(
      studentId,
      stayId,
      outgoId,
    );
  }
}
