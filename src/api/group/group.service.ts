import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from 'src/common/schemas';
import { CreateGroupDto, ResponseDto } from 'src/common/dto';

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

  async createGroup(data: CreateGroupDto): Promise<Group | false> {
    const existingGroup = await this.groupModel.findOne({ name: data.name });
    if (existingGroup) return false;

    const group = new this.groupModel({ ...data });

    await group.save();

    return group;
  }

  async initGroup(): Promise<ResponseDto> {
    const Admin = await this.createGroup({
      name: 'A',
      permissions: {
        view: ['*'],
        edit: ['*'],
      },
    });
    const Teacher = await this.createGroup({
      name: 'T',
      permissions: {
        view: ['laundry', 'stay', 'frigo', 'journal'],
        edit: ['frigo'],
      },
    });
    const Dormitory = await this.createGroup({
      name: 'D',
      permissions: {
        view: ['laundry', 'stay', 'frigo', 'journal'],
        edit: ['laundry', 'stay', 'journal'],
      },
    });

    return { status: 200, message: 'success' };
  }
}
