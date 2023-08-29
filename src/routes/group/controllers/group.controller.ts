import { Get, Post, Body, HttpException, UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { GroupService } from "../providers/group.service";
import { GroupDocument } from "src/schemas";
import { CreateGroupDto } from "../dto/group.dto";
import { ResponseDto } from "src/common/dto";
import { EditPermissionGuard, ViewPermissionGuard } from "src/auth/guards";
import { AuthGuard } from "@nestjs/passport";

@Controller("group")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard("jwt"), ViewPermissionGuard)
  @Get()
  async getAllgroup(): Promise<GroupDocument[]> {
    return await this.groupService.getAllGroup();
  }

  @UseGuards(AuthGuard("jwt"), EditPermissionGuard)
  @Post()
  async createGroup(@Body() data: CreateGroupDto): Promise<GroupDocument> {
    const result = await this.groupService.createGroup(data);
    if (!result)
      throw new HttpException("해당 이름의 Group이 이미 존재합니다.", 404);
    return result;
  }

  @Get("init")
  async initGroup(): Promise<ResponseDto> {
    return await this.groupService.initGroup();
  }
}
