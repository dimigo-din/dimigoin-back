import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group, GroupDocument } from "src/schemas";
import { CreateGroupDto } from "../dto/group.dto";
import { ResponseDto } from "src/common/dto";

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,
  ) {}

  async getAllGroup(): Promise<GroupDocument[]> {
    const groups = await this.groupModel.find();
    return groups;
  }

  async createGroup(data: CreateGroupDto): Promise<GroupDocument | false> {
    const existingGroup = await this.groupModel.findOne({ name: data.name });
    if (existingGroup) return false;

    const group = new this.groupModel({ ...data });

    await group.save();

    return group;
  }

  async initGroup(): Promise<ResponseDto> {
    await this.createGroup({
      name: "A",
      permissions: {
        view: ["*"],
        edit: ["*"],
      },
    });
    await this.createGroup({
      name: "T",
      permissions: {
        view: ["laundry", "stay", "frigo", "journal", "meal"],
        edit: ["frigo"],
      },
    });
    await this.createGroup({
      name: "D",
      permissions: {
        view: ["laundry", "stay", "frigo", "journal"],
        edit: ["laundry", "stay", "journal"],
      },
    });

    return { statusCode: 200, message: "success" };
  }
}
