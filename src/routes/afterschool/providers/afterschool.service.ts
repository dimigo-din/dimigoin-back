import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { ResponseDto } from "src/common/dto";

import {
  Afterschool,
  AfterschoolApplication,
  AfterschoolDocument,
  AfterschoolApplicationDocument,
  StudentDocument,
} from "src/schemas";

@Injectable()
export class AfterschoolService {
  constructor(
    @InjectModel(Afterschool.name)
    private afterschoolModel: Model<AfterschoolDocument>,

    @InjectModel(AfterschoolApplication.name)
    private afterschoolApplicationModel: Model<AfterschoolApplicationDocument>,
  ) {}

  async getAfterschools(
    student: StudentDocument,
  ): Promise<AfterschoolDocument[]> {
    const afterschools = await this.afterschoolModel.find({
      grade: student.grade,
    });

    return afterschools;
  }

  async getAfterschoolApplications(
    student: StudentDocument,
  ): Promise<AfterschoolApplicationDocument[]> {
    console.log(student._id);
    const afterschoolApplications = await this.afterschoolApplicationModel
      .find({
        student: student._id,
      })
      .populate("afterschool");

    return afterschoolApplications;
  }

  async applyAfterschool(
    student: StudentDocument,
    afterschoolId: Types.ObjectId,
  ): Promise<AfterschoolApplicationDocument> {
    const afterschool = await this.afterschoolModel.findById(afterschoolId);
    if (!afterschool)
      throw new HttpException("해당 방과후가 존재하지 않습니다.", 404);
    if (!afterschool.grade.includes(student.grade))
      throw new HttpException("신청 가능한 학년이 아닙니다.", 404);

    const applications = await this.afterschoolApplicationModel.find({
      student: student._id,
    });

    // time duplicate check
    for (const apply of applications) {
      const as = await this.afterschoolModel.findById(apply.afterschool);
      if (as.day == afterschool.day) {
        const ducplicate = as.time.filter((v) => as.time.includes(v));
        if (ducplicate.length != 0)
          throw new HttpException("방과후 시간이 중복됩니다.", 404);
      }
    }

    const application = new this.afterschoolApplicationModel({
      student: student._id,
      grade: student.grade,
      afterschool: afterschool._id,
    });

    await application.save();

    return application;
  }

  async cancelAfterschool(
    student: StudentDocument,
    afterschoolId: Types.ObjectId,
  ): Promise<ResponseDto> {
    const afterschool = await this.afterschoolModel.findById(afterschoolId);
    if (!afterschool)
      throw new HttpException("해당 방과후가 존재하지 않습니다.", 404);

    const application = await this.afterschoolApplicationModel
      .findOneAndDelete({ afterschool: afterschool._id, student: student._id })
      .lean();

    if (!application)
      throw new HttpException("방과후를 신청하지 않았습니다.", 404);

    return { statusCode: 201, message: "success" };
  }
}
