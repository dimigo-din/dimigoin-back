import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import moment from "moment";
import { Model } from "mongoose";

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

  async getLaundryTimetables(
    student: StudentDocument,
  ): Promise<LaundryTimetableDocument[]> {
    const type = await this.stayManageService.isStay();

    const laundries = await this.laundryTimetableModel
      .find({
        gender: student.gender,
        grade: student.grade,
        type: type,
      })
      .populate("laundry");

    return laundries;
  }

  async getLaundryApplications(
    student: StudentDocument,
  ): Promise<LaundryApplicationDocument[]> {
    const laundryTimetableIds = (await this.getLaundryTimetables(student)).map(
      (laundry) => laundry._id,
    );

    const laundryApplications = await this.laundryApplicationModel
      .find({
        timetable: { $in: laundryTimetableIds },
      })
      .populate({
        path: "timetable",
        populate: {
          path: "laundry",
        },
      })
      .populate({ path: "student", select: "name grade class number" });

    return laundryApplications;
  }

  async applyLaundry(
    student: StudentDocument,
    data: ApplyLaundryDto,
  ): Promise<LaundryApplicationDocument> {
    if (moment().hour() < 8)
      throw new HttpException("세탁 신청은 8시부터 가능합니다.", 403);

    const laundry = await this.laundryManageService.getLaundry(data.laundryId);
    const type = await this.stayManageService.isStay();

    const laundryTimetable = await this.laundryTimetableModel.findOne({
      laundry: laundry._id,
      gender: student.gender,
      grade: student.grade,
      type: type,
    });
    if (!laundryTimetable)
      throw new HttpException("신청 가능한 세탁기가 아닙니다.", 404);
    if (data.time > laundryTimetable.sequence.length)
      throw new HttpException("신청 가능한 시간이 아닙니다.", 404);

    const existingLaundryApplication =
      await this.laundryApplicationModel.findOne({
        timetable: laundryTimetable._id,
        time: data.time,
      });
    if (existingLaundryApplication)
      throw new HttpException("이미 신청된 시간입니다.", 403);

    const existingStudentLaundryApplication =
      await this.laundryApplicationModel.find({
        student: student._id,
      });
    if (existingStudentLaundryApplication.length === 1) {
      const timetable = await this.laundryTimetableModel.findById(
        existingStudentLaundryApplication[0].timetable,
      );
      const userTimetable = await this.laundryTimetableModel.findById(
        laundryTimetable._id,
      );
      if (timetable) {
        const laundry = await this.laundryModel.findById(timetable.laundry);
        const userLaundry = await this.laundryModel.findById(
          userTimetable.laundry,
        );
        if (laundry) {
          if (String(laundry.floor).length === String(userLaundry.floor).length)
            throw new HttpException("이미 신청한 세탁이 있습니다.", 403);
        }
      }
    }
    if (existingStudentLaundryApplication.length === 2) {
      throw new HttpException("이미 신청한 세탁이 있습니다.", 403);
    }

    const laundryApplication = new this.laundryApplicationModel({
      timetable: laundryTimetable._id,
      student: student._id,
      time: data.time,
    });

    await laundryApplication.save();

    return laundryApplication;
  }

  async cancelLaundry(
    student: StudentDocument,
    laundryApplicationId: string,
  ): Promise<LaundryApplicationDocument> {
    const laundryApplication =
      await this.laundryApplicationModel.findOneAndDelete({
        student: student._id,
        id: laundryApplicationId,
      });

    if (!laundryApplication)
      throw new HttpException("신청한 세탁이 없습니다.", 404);

    return laundryApplication;
  }
}
