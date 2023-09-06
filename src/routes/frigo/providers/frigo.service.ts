import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  FrigoDocument,
  FrigoApplication,
  FrigoApplicationDocument,
  StudentDocument,
} from "src/schemas";

import { ApplyFrigoDto } from "../dto";

import { FrigoManageService } from "./frigo.manage.service";

@Injectable()
export class FrigoService {
  constructor(
    @InjectModel(FrigoApplication.name)
    private frigoApplicationModel: Model<FrigoApplicationDocument>,

    private frigoManageService: FrigoManageService,
  ) {}

  async getCurrentFrigo(): Promise<FrigoDocument> {
    const frigo = this.frigoManageService.getCurrentFrigo();

    return frigo;
  }

  async applyFrigo(
    student: StudentDocument,
    data: ApplyFrigoDto,
  ): Promise<FrigoApplicationDocument> {
    const frigo = await this.frigoManageService.getCurrentFrigo();

    const existingApplication = await this.frigoApplicationModel.findOne({
      frigo: frigo._id,
      student: student._id,
    });
    if (existingApplication)
      throw new HttpException("이미 금요귀가를 신청했습니다.", 403);

    const application = new this.frigoApplicationModel({
      frigo: frigo._id,
      student: student._id,
      status: "W",
      ...data,
    });
    await application.save();

    return application;
  }

  async cancelFrigo(
    student: StudentDocument,
  ): Promise<FrigoApplicationDocument> {
    const frigo = await this.frigoManageService.getCurrentFrigo();

    const frigoApplication = await this.frigoApplicationModel.findOneAndDelete({
      frigo: frigo._id,
      student: student._id,
    });
    if (!frigoApplication)
      throw new HttpException("금요귀가를 신청하지 않았습니다.", 404);

    return frigoApplication;
  }
}
