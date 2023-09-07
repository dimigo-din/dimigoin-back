import { Injectable, HttpException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Group, GroupDocument } from "src/schemas";

import { CreateGroupDto } from "../dto";

@Injectable()
export class GroupManageService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
  ) {}

  async getGroups(): Promise<GroupDocument[]> {
    const groups = await this.groupModel.find();

    return groups;
  }

  async getGroup(groupId: Types.ObjectId): Promise<GroupDocument> {
    const group = await this.groupModel.findById(groupId);
    if (!group) throw new HttpException("그룹을 찾을 수 없습니다.", 404);

    return group;
  }

  async createGroup(data: CreateGroupDto): Promise<GroupDocument> {
    const existingGroup = await this.groupModel.findOne({ name: data.name });
    if (existingGroup)
      throw new HttpException("같은이름의 그룹이 존재합니다.", 404);

    const group = new this.groupModel(data);

    await group.save();
    return group;
  }

  async editGroup(
    groupId: Types.ObjectId,
    data: CreateGroupDto,
  ): Promise<GroupDocument> {
    const group = await this.groupModel.findById(groupId);
    for (const newKey of Object.keys(data)) {
      group[newKey] = data[newKey];
    }

    await group.save();
    return group;
  }
}
