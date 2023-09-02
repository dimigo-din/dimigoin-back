import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { UserService } from "src/routes/user/providers";

import {
  Stay,
  StayDocument,
  StayApplication,
  StayApplicationDocument,
  StayOutgo,
  StayOutgoDocument,
} from "src/schemas";

import { ApplyStayDto, CreateStayDto } from "../dto";

@Injectable()
export class StayManageService {
  constructor(
    @InjectModel(Stay.name)
    private stayModel: Model<StayDocument>,

    @InjectModel(StayApplication.name)
    private stayApplicationModel: Model<StayApplicationDocument>,

    @InjectModel(StayOutgo.name)
    private stayOutgoModel: Model<StayOutgoDocument>,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async getAll(): Promise<StayDocument[]> {
    const stays = await this.stayModel.find();

    return stays;
  }

  async create(data: CreateStayDto): Promise<StayDocument> {
    const stay = new this.stayModel({
      current: false,
      ...data,
    });
    await stay.save();

    return stay;
  }

  async delete(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.stayModel.findByIdAndDelete(stayId);
    if (!stay)
      throw new HttpException("해당 잔류일정이 존재하지 않습니다.", 404);

    return stay;
  }

  async get(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.stayModel.findById(stayId);
    if (!stay)
      throw new HttpException("해당 잔류일정이 존재하지 않습니다.", 404);

    return stay;
  }

  async getApplications(
    stayId: Types.ObjectId,
  ): Promise<StayApplicationDocument[]> {
    const stay = await this.stayModel.findById(stayId);
    if (!stay)
      throw new HttpException("해당 잔류일정이 존재하지 않습니다.", 404);

    const applications = await this.stayApplicationModel
      .find({
        stay: stay._id,
      })
      .populate({
        path: "user",
      });

    return applications;
  }

  async applyStudent(
    studentId: Types.ObjectId,
    data: ApplyStayDto,
  ): Promise<StayApplicationDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("신청가능한 잔류일정이 없습니다.", 404);

    const student = await this.userService.getStudent(studentId);

    if (!stay.seat[student.gender + student.grade].includes(data.seat))
      throw new HttpException("해당 학년이 신청 가능한 좌석이 아닙니다.", 403);

    const existingApplication = await this.stayApplicationModel.findOne({
      user: student._id,
    });
    if (existingApplication)
      throw new HttpException("이미 잔류를 신청했습니다.", 403);

    if (data.seat === "NONE" && !data.reason)
      throw new HttpException("미선택 사유를 입력해주세요.", 403);
    if (data.seat !== "NONE") data.reason = "";

    const application = new this.stayApplicationModel({
      stay: stay._id,
      user: student._id,
      ...data,
    });

    await application.save();

    return application;
  }

  async cancelStudent(
    studentId: Types.ObjectId,
  ): Promise<StayApplicationDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("취소가능한 잔류일정이 없습니다.", 404);

    const student = await this.userService.getStudent(studentId);

    const application = await this.stayApplicationModel.findOneAndDelete({
      stay: stay._id,
      user: student._id,
    });
    if (!application)
      throw new HttpException("취소할 잔류신청이 없습니다.", 404);

    await this.stayOutgoModel.deleteMany({ user: studentId });

    return application;
  }
}
