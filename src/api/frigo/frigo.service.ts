import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Frigo, FrigoDocument, StudentDocument } from 'src/common/schemas';
import { ManageFrigoDto, RequestFrigoDto } from 'src/common/dto';

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

  async getMyFrigo(user: StudentDocument): Promise<FrigoDocument> {
    const frigoRequest = await this.frigoModel.findOne({ id: user._id });
    if (!frigoRequest)
      throw new HttpException('이번주 금요귀가를 신청하지 않았습니다.', 404);
    return frigoRequest;
  }

  async requestFrigo(
    data: RequestFrigoDto,
    user: StudentDocument,
  ): Promise<FrigoDocument> {
    const existingFrigoRequest = await this.frigoModel.findOne({
      id: user._id,
    });
    if (existingFrigoRequest)
      throw new HttpException('이미 이번주 금요귀가를 신청했습니다.', 404);

    const frigoRequest = new this.frigoModel({
      ...data,
      id: user._id,
      grade: user.grade,
      class: user.class,
      name: user.name,
      status: 'W',
    });

    await frigoRequest.save();

    return frigoRequest;
  }

  async manageFrigo(data: ManageFrigoDto): Promise<FrigoDocument> {
    const frigo = await this.frigoModel.findById(data.frigo);
    if (!frigo)
      throw new HttpException('해당 금요귀가 요청이 존재하지 않습니다.', 404);

    frigo.status = data.status;
    await frigo.save();

    return frigo;
  }
}
