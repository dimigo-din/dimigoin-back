import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model, Types } from "mongoose";

import { StayManageService } from "src/routes/stay/providers";

import {
  Laundry,
  LaundryDocument,
  LaundryTimetable,
  LaundryTimetableDocument,
  StudentDocument,
} from "src/schemas";

import { ApplyLaundryDto } from "../dto";

import { LaundryManageService } from "./laundry.manage.service";

@Injectable()
export class LaundryService {
  constructor(
    @InjectModel(Laundry.name)
    private laundryModel: Model<LaundryDocument>,

    @InjectModel(LaundryTimetable.name)
    private laundryTimetableModel: Model<LaundryTimetableDocument>,

    private laundryManageService: LaundryManageService,
    private stayManageService: StayManageService,
  ) {}

  async getAllLaundryTimetable(
    student: StudentDocument,
  ): Promise<LaundryTimetableDocument[]> {
    const isTodayStay = await this.stayManageService.isStay();

    return await this.laundryTimetableModel
      .find({
        gender: student.gender,
        grade: student.grade,
        isStaySchedule: isTodayStay,
      })
      .populate({ path: "laundry" })
      .populate({ path: "sequence.student" });
  }

  async applyLaundry(student: StudentDocument, body: ApplyLaundryDto) {
    if (moment().hour() < 8)
      throw new HttpException("세탁 신청은 오전 8시부터 가능합니다.", 403);

    const isTodayStay = await this.stayManageService.isStay(); // 오늘이 잔류 시간표인가?

    const checkTimetableExists = await this.laundryTimetableModel.findOne(
      // 일단 시간표가 valid한지 먼저 확인
      {
        gender: student.gender,
        grade: student.grade,
        isStaySchedule: isTodayStay,
        sequence: {
          $elemMatch: { _id: body.laundryTimetableId },
        },
      },
      { "sequence.$": 1 },
    );

    if (!checkTimetableExists)
      throw new HttpException("신청 가능한 세탁기 시간표가 아닙니다.", 404); // 없으면 퉤

    const checkStudentAlreadyApplied = await this.laundryTimetableModel // 신청하려는 학생이 이미 건조기 or 세탁기를 신청했는지 확인
      .findOne({
        "laundry.laundryType": body.laundryType,
        gender: student.gender,
        grade: student.grade,
        isStaySchedule: isTodayStay,
        sequence: {
          student: student._id,
        },
      })
      .populate<{ laundry: Laundry }>({ path: "laundry" });

    if (checkStudentAlreadyApplied)
      // 있으면 퉤
      throw new HttpException(
        `이미 신청한 ${
          body.laundryType == "washer" ? "세탁기" : "건조기"
        }가 있습니다.`,
        403,
      );

    if (checkTimetableExists.sequence[0].applicant)
      // valid한 시간표는 맞는데 누가 이미 신청했네? 퉤
      throw new HttpException("이미 신청된 시간입니다.", 403);

    return await this.laundryTimetableModel.updateOne(
      // 발뻗잠
      {
        sequence: {
          $elemMatch: {
            _id: body.laundryTimetableId,
          },
        },
      },
      {
        $set: {
          "sequence.$.applicant": student._id,
        },
      },
    );
  }

  async cancelLaundry(
    student: StudentDocument,
    laundryApplicationId: Types.ObjectId,
  ) {
    return await this.laundryTimetableModel.updateOne(
      {
        sequence: {
          $elemMatch: {
            _id: laundryApplicationId,
            applicant: student._id,
          },
        },
      },
      {
        $set: {
          "sequence.$.applicant": null,
        },
      },
    );
  }
}
