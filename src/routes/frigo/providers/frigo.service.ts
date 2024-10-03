import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  FrigoApplication,
  FrigoApplicationDocument,
  StudentDocument,
} from "src/schemas";

import { ApplyFrigoRequestDto } from "../dto";

import { FrigoManageService } from "./frigo.manage.service";

@Injectable()
export class FrigoService {
  constructor(
    @InjectModel(FrigoApplication.name)
    private frigoApplicationModel: Model<FrigoApplicationDocument>,

    private frigoManageService: FrigoManageService,
  ) {}

  async applyFrigo(
    student: StudentDocument,
    body: ApplyFrigoRequestDto,
  ): Promise<FrigoApplicationDocument> {
    const currentFrigo = await this.frigoManageService.getCurrentFrigo();

    const existingApplication = await this.frigoApplicationModel.findOne({
      frigo: currentFrigo._id,
      student: student._id,
    });

    if (existingApplication)
      throw new HttpException("이미 금요귀가를 신청했습니다.", 403);

    return await this.frigoApplicationModel.create({
      frigo: currentFrigo._id,
      student: student._id,
      status: "W",
      ...body,
    });
  }

  async cancelFrigo(
    student: StudentDocument,
  ): Promise<FrigoApplicationDocument> {
    const currentFrigo = await this.frigoManageService.getCurrentFrigo();

    const frigoApplication = await this.frigoApplicationModel.findOneAndDelete({
      frigo: currentFrigo._id,
      student: student._id,
    });

    if (!frigoApplication)
      throw new HttpException("신청한 금요귀가가 없습니다.", 404);

    return frigoApplication;
  }
}
