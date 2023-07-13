import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStayDto } from 'src/common/dto';
import { Stay, StayDocument } from 'src/common/schemas';

@Injectable()
export class StayService {
  constructor(
    @InjectModel(Stay.name)
    private stayModel: Model<StayDocument>,
  ) {}

  async getAllStay(): Promise<Stay[]> {
    const stays = await this.stayModel.find();
    return stays;
  }

  async getCurrentStay(): Promise<Stay> {
    const stay = await this.stayModel.findOne({ disabled: false });

    return stay;
  }

  async createStay(data: CreateStayDto): Promise<Stay> {
    const existingStay = await this.stayModel.findOne({ disabled: false });
    const disable = existingStay ? false : true;

    const stay = new this.stayModel({
      ...data,
      disabled: disable,
    });

    await stay.save();

    return stay;
  }

  // async manageStay(data: CreateStayDto): Promise<Stay> {
  //   const existingStay = await this.stayModel.findOne({ disabled: false });
  //   const disable = existingStay ? false : true;

  //   const stay = new this.stayModel({
  //     ...data,
  //     disabled: disable,
  //   });

  //   await stay.save();

  //   return stay;
  // }
}
