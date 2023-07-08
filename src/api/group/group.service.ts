import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from 'src/common/schemas';
import { CreateGroupDto } from 'src/common/dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
  ) {}

  async getAllGroup(): Promise<Group[]> {
    const groups = await this.groupModel.find();
    return groups;
  }

  async createGroup(data: CreateGroupDto): Promise<Group> {
    const existingGroup = await this.groupModel.findOne({ name: data.name });
    if (existingGroup)
      throw new HttpException('해당 이름의 Group이 이미 존재합니다.', 404);

    const group = new this.groupModel({ ...data });

    await group.save();

    return group;
  }
}
