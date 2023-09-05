import {
  Get,
  Post,
  Body,
  HttpException,
  UseGuards,
  Controller,
} from "@nestjs/common";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { ResponseDto } from "src/common/dto";

import { GroupDocument } from "src/schemas";

import { CreateGroupDto } from "../dto";
import { GroupService } from "../providers";

@Controller("group")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  async getAllgroup(): Promise<GroupDocument[]> {
    return await this.groupService.getAllGroup();
  }

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async createGroup(@Body() data: CreateGroupDto): Promise<GroupDocument> {
    const result = await this.groupService.createGroup(data);
    if (!result)
      throw new HttpException("해당 이름의 Group이 이미 존재합니다.", 404);
    return result;
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("init")
  async initGroup(): Promise<ResponseDto> {
    return await this.groupService.initGroup();
  }
}
