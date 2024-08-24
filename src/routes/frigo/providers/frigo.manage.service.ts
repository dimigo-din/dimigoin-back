import { HttpException, Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { UserManageService } from "src/routes/user/providers";

import {
  Frigo,
  FrigoDocument,
  FrigoApplication,
  FrigoApplicationDocument,
} from "src/schemas";

import { CreateFrigoDto } from "../dto";

@Injectable()
export class FrigoManageService {
  constructor(
    @InjectModel(Frigo.name)
    private frigoModel: Model<FrigoDocument>,

    @InjectModel(FrigoApplication.name)
    private frigoApplicationModel: Model<FrigoApplicationDocument>,

    @Inject(forwardRef(() => UserManageService))
    private userManageService: UserManageService,
  ) {}

  async createFrigo(data: CreateFrigoDto): Promise<FrigoDocument> {
    const existingFrigo = await this.frigoModel.findOne({
      date: data.date,
    });
    if (existingFrigo)
      throw new HttpException("같은 정보의 금요귀가가 있습니다.", 403);

    const frigo = new this.frigoModel({
      ...data,
      current: false,
    });

    await frigo.save();
    return frigo;
  }

  async getFrigos(): Promise<FrigoDocument[]> {
    return await this.frigoModel.find();
  }

  async getFrigo(frigoId: Types.ObjectId): Promise<FrigoDocument> {
    const frigo = await this.frigoModel.findById(frigoId);
    if (!frigo) throw new HttpException("해당하는 금요귀가가 없습니다.", 404);

    return frigo;
  }

  async editFrigo(
    frigoId: Types.ObjectId,
    data: CreateFrigoDto,
  ): Promise<FrigoDocument> {
    const frigo = await this.getFrigo(frigoId);
    for (const newKey of Object.keys(data)) {
      frigo[newKey] = data[newKey];
    }

    await frigo.save();
    return frigo;
  }

  async deleteFrigo(frigoId: Types.ObjectId): Promise<FrigoDocument> {
    const frigo = await this.getFrigo(frigoId);
    await this.frigoModel.findByIdAndDelete(frigo._id);

    return frigo;
  }

  async getCurrentFrigo(): Promise<FrigoDocument> {
    const frigo = await this.frigoModel.findOne({ current: true });
    if (!frigo) throw new HttpException("활성화된 금요귀가가 없습니다.", 404);

    return frigo;
  }

  async setCurrentFrigo(frigoId: Types.ObjectId): Promise<FrigoDocument> {
    const frigo = await this.getFrigo(frigoId);
    const currentFrigo = await this.frigoModel.findOne({
      current: true,
    });
    if (currentFrigo) {
      currentFrigo.current = false;
      await currentFrigo.save();
    }

    frigo.current = true;

    await frigo.save();
    return frigo;
  }

  async deleteCurrentFrigo(frigoId: Types.ObjectId): Promise<FrigoDocument> {
    const frigo = await this.getFrigo(frigoId);

    frigo.current = false;

    await frigo.save();
    return frigo;
  }

  async getStudentFrigoApplication(
    studentId: Types.ObjectId,
    frigoId: Types.ObjectId,
  ): Promise<FrigoApplicationDocument> {
    const student = await this.userManageService.getStudent(studentId);
    const frigo = await this.getFrigo(frigoId);
    const application = await this.frigoApplicationModel
      .findOne({
        student: student._id,
        frigo: frigo._id,
      })
      .populate("frigo")
      .populate("student");

    return application;
  }

  async setStudentFrigoApprove(
    applicationId: Types.ObjectId,
    approve: boolean,
  ) {
    const frigoApplication = this.frigoApplicationModel.findOneAndUpdate(
      {
        _id: applicationId,
      },
      {
        $set: {
          status: approve ? "A" : "R",
        },
      },
    );
    if (!frigoApplication)
      throw new HttpException("해당 금요귀가 신청이 없습니다.", 404);

    return this.frigoApplicationModel
      .findById(applicationId)
      .populate("frigo")
      .populate("student");
  }

  async getStudentFrigoApplications(
    frigoId: Types.ObjectId,
  ): Promise<FrigoApplicationDocument[]> {
    const frigo = await this.getFrigo(frigoId);
    const applications = await this.frigoApplicationModel
      .find({
        frigo: frigo._id,
      })
      .populate("frigo")
      .populate("student");

    return applications;
  }
}
