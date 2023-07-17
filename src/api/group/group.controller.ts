import { Get, Post, Body, HttpException, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from 'src/common/schemas';
import { CreateGroupDto, ResponseDto } from 'src/common/dto';
import { EditPermissionGuard, ViewPermissionGuard } from 'src/common/guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(ViewPermissionGuard)
  @Get()
  getAllgroup(): Promise<Group[]> {
    return this.groupService.getAllGroup();
  }

  @UseGuards(EditPermissionGuard)
  @Post()
  async createGroup(@Body() data: CreateGroupDto): Promise<Group> {
    const result = await this.groupService.createGroup(data);
    if (!result)
      throw new HttpException('해당 이름의 Group이 이미 존재합니다.', 404);
    return result;
  }

  @Post('init')
  initGroup(): Promise<ResponseDto> {
    return this.groupService.initGroup();
  }
}
