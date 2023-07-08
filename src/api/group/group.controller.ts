import { Get, Post, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from 'src/common/schemas';
import { CreateGroupDto } from 'src/common/dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  getAllgroup(): Promise<Group[]> {
    return this.groupService.getAllGroup();
  }

  @Post()
  createGroup(@Body() data: CreateGroupDto): Promise<Group> {
    return this.groupService.createGroup(data);
  }
}
