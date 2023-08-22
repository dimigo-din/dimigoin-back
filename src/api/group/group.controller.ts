import { Get, Post, Body, HttpException, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group, GroupDocument } from 'src/common/schemas';
import { CreateGroupDto, ResponseDto } from 'src/common/dto';
import { EditPermissionGuard, ViewPermissionGuard } from 'src/common/guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(ViewPermissionGuard)
  @Get()
  async getAllgroup(): Promise<GroupDocument[]> {
    return await this.groupService.getAllGroup();
  }

  @UseGuards(EditPermissionGuard)
  @Post()
  async createGroup(@Body() data: CreateGroupDto): Promise<GroupDocument> {
    const result = await this.groupService.createGroup(data);
    if (!result)
      throw new HttpException('해당 이름의 Group이 이미 존재합니다.', 404);
    return result;
  }

  @Get('init')
  async initGroup(): Promise<ResponseDto> {
    return await this.groupService.initGroup();
  }
}
