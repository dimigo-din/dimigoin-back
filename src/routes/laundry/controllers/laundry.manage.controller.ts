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
import { createOpertation } from "src/lib/utils";

import { LaundryDocument, LaundryTimetableDocument } from "src/schemas";

import { CreateLaundryDto, CreateLaundryTimetableDto } from "../dto";
import { LaundryManageService } from "../providers";

@ApiTags("Laundry Manage")
@Controller("manage/laundry")
export class LaundryManageController {
  constructor(private readonly laundryManageService: LaundryManageService) {}

  @ApiOperation(
    createOpertation({
      name: "세탁기 및 건조기 리스트",
      description:
        "기숙사 (학봉관, 우정학사) 내에 존재하는 모든 세탁기 및 건조기를 반환합니다.",
    }),
  )
  @Get()
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async getLaundries(): Promise<{
    laundries: LaundryDocument[];
    timetables: LaundryTimetableDocument[];
  }> {
    const laundries = await this.laundryManageService.getAllLaundry();
    const timetables =
      await this.laundryManageService.getAllLaundryTimetables();

    return {
      laundries,
      timetables,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "세탁기 혹은 건조기 생성",
      description: "세탁기 혹은 건조기를 생성합니다.",
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
      name: "세탁기 및 건조기 신청 초기화",
      description: "모든 세탁기 및 건조기의 신청을 초기화합니다.",
    }),
  )
  @Delete()
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async deleteLaundryApplications() {
    return await this.laundryManageService.deleteLaundryApplications();
  }

  @ApiOperation(
    createOpertation({
      name: "세탁기 및 건조기 시간표 불러오기",
      description: "모든 세탁기 및 건조기 시간표를 불러옵니다",
    }),
  )
  @Get("/timetable")
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  async getLaundryTimetable() {
    return this.laundryManageService.getAllLaundryTimetables();
  }

  @ApiOperation(
    createOpertation({
      name: "세탁기 및 건조기 시간표 수정",
      description: "세탁기 및 건조기 시간표를 수정합니다.",
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
}
