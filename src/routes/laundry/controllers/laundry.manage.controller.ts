import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import {
  LaundryDocument,
  LaundryApplicationDocument,
  LaundryTimetableDocument,
} from "src/schemas";

import { CreateLaundryDto, CreateLaundryTimetableDto } from "../dto";
import { LaundryManageService } from "../providers";

@ApiTags("Laundry Manage")
@Controller("manage/laundry")
export class LaundryManageController {
  constructor(private readonly laundryManageService: LaundryManageService) {}

  @ApiOperation(
    createOpertation({
      name: "세탁기 리스트",
      description: "모든 세탁기를 반환합니다.",
    }),
  )
  @Get()
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async getLaundries(): Promise<LaundryDocument[]> {
    const laundries = await this.laundryManageService.getLaundries();

    return laundries;
  }

  @ApiOperation(
    createOpertation({
      name: "세탁기 생성",
      description: "세탁기를 생성합니다.",
    }),
  )
  @Post()
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async createLaundry(
    @Body() data: CreateLaundryDto,
  ): Promise<LaundryDocument> {
    const laundry = await this.laundryManageService.createLaundry(data);

    return laundry;
  }

  @ApiOperation(
    createOpertation({
      name: "세탁 신청 초기화",
      description: "모든 세탁기의 신청을 초기화합니다.",
    }),
  )
  @Delete()
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async deleteLaundryApplications(): Promise<LaundryApplicationDocument[]> {
    const response =
      await this.laundryManageService.deleteLaundryApplications();

    return response;
  }

  @ApiOperation(
    createOpertation({
      name: "세탁 시간표 불러오기",
      description: "모든 세탁 시간표를 불러옵니다",
    }),
  )
  @Get("/timetable")
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async getLaundryTimetable() {
    return this.laundryManageService.getLaundryTimetables();
  }

  @ApiOperation(
    createOpertation({
      name: "세탁 시간표 수정",
      description: "세탁기 시간표를 수정합니다.",
    }),
  )
  @Put("/timetable")
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async updateLaundryTimetable(
    @Body() data: CreateLaundryTimetableDto,
  ): Promise<LaundryTimetableDocument> {
    const laundryTimetable =
      await this.laundryManageService.updateLaundryTimetable(data);

    return laundryTimetable;
  }

  @ApiOperation(
    createOpertation({
      name: "세탁 신청 현황 불러오기",
      description: "모든 세탁기의 신청 현황을 불러옵니다.",
    }),
  )
  @Get("/application")
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async getLaundryApplications() {
    return this.laundryManageService.getLaundryApplications();
  }
}
