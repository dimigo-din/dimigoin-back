import {
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Controller,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Types } from "mongoose";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { GroupDocument } from "src/schemas";

import { CreateGroupDto } from "../dto";
import { GroupManageService } from "../providers";

@ApiTags("Group Manage")
@Controller("manage/group")
export class GroupManageController {
  constructor(private readonly groupManageService: GroupManageService) {}

  @ApiOperation(
    createOpertation({
      name: "그룹 리스트",
      description: "모든 그룹을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  async getGroups(): Promise<GroupDocument[]> {
    return await this.groupManageService.getGroups();
  }

  @ApiOperation(
    createOpertation({
      name: "그룹 생성",
      description: "그룹을 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async createGroup(@Body() data: CreateGroupDto): Promise<GroupDocument> {
    return await this.groupManageService.createGroup(data);
  }

  @ApiOperation(
    createOpertation({
      name: "그룹 수정",
      description: "그룹을 수정합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Put(":groupId")
  async editGroup(
    @Param("groupId") groupId: Types.ObjectId,
    @Body() data: CreateGroupDto,
  ): Promise<GroupDocument> {
    return await this.groupManageService.editGroup(groupId, data);
  }
}
