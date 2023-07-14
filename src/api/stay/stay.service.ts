import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStayDto, ManageStayDto } from 'src/common/dto';
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
    const stay = await this.stayModel.findOne({ current: true });

    return stay;
  }

  async createStay(data: CreateStayDto): Promise<Stay> {
    const existingStay = await this.stayModel.findOne({ current: true });
    const current = existingStay ? false : true;

    const stay = new this.stayModel({
      ...data,
      current: current,
    });

    await stay.save();

    return stay;
  }

  async manageStay(data: ManageStayDto): Promise<Stay> {
    const existingStay = await this.stayModel.findOne({ current: true });
    if (data.current && existingStay)
      throw new HttpException('이미 활성화된 잔류일정이 존재합니다.', 404);

    const stay = await this.stayModel.findById(data.stay);
    if (!stay) throw new HttpException('해당 잔류일정이 존재하지 않습니다.', 404);
    stay.current = data.current;

    await stay.save();

    return stay;
  }
}
