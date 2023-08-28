import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Frigo, FrigoDocument, StudentDocument } from "src/schemas";
import { ManageFrigoDto, RequestFrigoDto } from "../dto/frigo.dto";
import { ResponseDto } from "src/common/dto";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class FrigoService {
  constructor(
    @InjectModel(Frigo.name)
    private frigoModel: Model<FrigoDocument>,
  ) {}

  async getAllFrigo(): Promise<FrigoDocument[]> {
    const frigoRequests = await this.frigoModel.find();
    return frigoRequests;
  }

  async getMyFrigo(user: StudentDocument): Promise<object | boolean> {
    const frigoRequest = await this.frigoModel.findOne({ id: user._id });
    if (!frigoRequest) return false;
    return { statusDto: frigoRequest.status, reason: frigoRequest.reason };
  }

  async requestFrigo(
    data: RequestFrigoDto,
    user: StudentDocument,
  ): Promise<FrigoDocument> {
    const existingFrigoRequest = await this.frigoModel.findOne({
      id: user._id,
    });
    if (existingFrigoRequest)
      throw new HttpException("이미 이번주 금요귀가를 신청했습니다.", 404);

    const frigoRequest = new this.frigoModel({
      ...data,
      id: user._id,
      grade: user.grade,
      class: user.class,
      name: user.name,
      status: "W",
    });

    await frigoRequest.save();

    return frigoRequest;
  }

  async cancelFrigo(user: StudentDocument): Promise<ResponseDto> {
    const frigo = await this.frigoModel
      .findOneAndDelete({ id: user._id })
      .lean();
    if (!frigo) throw new HttpException("금요귀가를 신청하지 않았습니다.", 404);

    return { statusCode: 200, message: "success" };
  }

  async manageFrigo(data: ManageFrigoDto): Promise<FrigoDocument> {
    const frigo = await this.frigoModel.findById(data.frigo);
    if (!frigo)
      throw new HttpException("해당 금요귀가 요청이 존재하지 않습니다.", 404);

    frigo.status = data.status;
    await frigo.save();

    return frigo;
  }

  @Cron(CronExpression.EVERY_WEEK)
  async resetFrigo() {
    // every week, frigo reset
    await this.frigoModel.deleteMany({});
  }
}
