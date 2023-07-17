import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  ApplyStayDto,
  ApplyStayOutgoDto,
  ManageStayOutgoDto,
  CreateStayDto,
  ManageStayDto,
  ResponseDto,
} from 'src/common/dto';
import {
  Stay,
  StayDocument,
  StayApplication,
  StayApplicationDocument,
  StayOutgo,
  StayOutgoDocument,
  Student,
  StudentDocument,
} from 'src/common/schemas';
import moment, { duration } from 'moment';

@Injectable()
export class StayService {
  constructor(
    @InjectModel(Stay.name)
    private stayModel: Model<StayDocument>,

    @InjectModel(StayApplication.name)
    private stayApplicationModel: Model<StayApplicationDocument>,

    @InjectModel(StayOutgo.name)
    private stayOutgoModel: Model<StayOutgoDocument>,
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
    if (!stay)
      throw new HttpException('해당 잔류일정이 존재하지 않습니다.', 404);
    stay.current = data.current;

    await stay.save();

    return stay;
  }

  async applyStay(
    data: ApplyStayDto,
    user: ObjectId,
  ): Promise<StayApplication> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException('신청가능한 잔류일정이 없습니다.', 404);

    const existingApplication = await this.stayApplicationModel.findOne({
      user,
    });
    if (existingApplication)
      throw new HttpException('이미 잔류를 신청했습니다.', 404);

    const application = new this.stayApplicationModel({
      ...data,
      user: user,
      stay: stay._id,
    });

    await application.save();

    return application;
  }

  async cancelStay(user: string): Promise<ResponseDto> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException('취소가능한 잔류일정이 없습니다.', 404);

    const application = await this.stayApplicationModel.findOneAndDelete({
      stay: stay._id,
      user: user,
    });
    if (!application)
      throw new HttpException('취소할 잔류신청이 없습니다.', 404);

    return { status: 200, message: 'success' };
  }

  async getMyStay(user: StudentDocument): Promise<string | boolean> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return false;

    const application = await this.stayApplicationModel.findOne({
      stay: stay._id,
      user: user._id,
    });
    if (!application) return false;
    if (!application.seat) return '교실';
    return application.seat;
  }

  async getMyStayOutgo(user: StudentDocument): Promise<any> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) return false;

    const outgo = await this.stayOutgoModel.find({
      stay: stay._id,
      user: user._id,
    });

    if (outgo.length == 0) return false;
    const result = [];
    for (let i = 0; i < outgo.length; i++) {
      result.push({ duration: outgo[i].duration, status: outgo[i].status });
    }

    return result;
  }

  async applyStayOutgo(data: ApplyStayOutgoDto, user: ObjectId): Promise<any> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException('신청가능한 잔류일정이 없습니다.', 404);

    const start = moment(data.duration.start);
    const end = moment(data.duration.end);

    for (const date of stay.dates) {
      const startline = moment(date.date).startOf('day');
      const endline = startline.clone().endOf('day');

      if (
        start.isBetween(startline, endline) &&
        end.isBetween(startline, endline) &&
        date.outgo &&
        end.isAfter(start)
      ) {
        const stayOutgo = new this.stayOutgoModel({
          ...data,
          user: user,
          stay: stay._id,
          status: 'W',
        });

        await stayOutgo.save();

        return stayOutgo;
      }
    }

    throw new HttpException('올바른 잔류외출 신청이 아닙니다.', 401);
  }

  async manageStayOutgo(data: ManageStayOutgoDto): Promise<StayOutgo> {
    const stayOutgo = await this.stayOutgoModel.findById(data.outgo);
    if (!stayOutgo) throw new HttpException('해당 잔류외출 신청이 존재하지 않습니다.', 404);

    stayOutgo.status = data.status;

    await stayOutgo.save();

    return stayOutgo;
  }
}
