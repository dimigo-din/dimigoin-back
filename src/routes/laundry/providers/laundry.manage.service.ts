import { HttpException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model, Types } from "mongoose";

import { UserManageService } from "src/routes/user/providers";

import {
  Laundry,
  LaundryDocument,
  LaundryTimetable,
  LaundryTimetableDocument,
  LaundryApplication,
  LaundryApplicationDocument,
} from "src/schemas";

import { StayManageService } from "../../stay/providers";
import { CreateLaundryDto, CreateLaundryTimetableDto } from "../dto";

@Injectable()
export class LaundryManageService {
  constructor(
    @InjectModel(Laundry.name)
    private laundryModel: Model<LaundryDocument>,

    @InjectModel(LaundryTimetable.name)
    private laundryTimetableModel: Model<LaundryTimetableDocument>,

    @InjectModel(LaundryApplication.name)
    private laundryApplicationModel: Model<LaundryApplicationDocument>,

    @Inject(forwardRef(() => UserManageService))
    private userManageService: UserManageService,

    @Inject(forwardRef(() => StayManageService))
    private stayManageService: StayManageService,
  ) {}

  async getLaundries(): Promise<LaundryDocument[]> {
    const laundries = await this.laundryModel
      .find()
      .sort({ gender: -1 })
      .sort({ floor: 1 })
      .sort({ position: 1 });

    const timetable = await this.getLaundryTimetables();

    return laundries.map((laundry) => {
      return {
        ...laundry,
        timetable: timetable.filter((time) =>
          laundry._id.equals(time.laundry._id),
        ),
      };
    });
  }

  async getLaundry(laundryId: Types.ObjectId): Promise<LaundryDocument> {
    const laundry = await this.laundryModel.findById(laundryId);
    if (!laundry)
      throw new HttpException("해당 세탁기가 존재하지 않습니다.", 404);

    return laundry;
  }

  async createLaundry(data: CreateLaundryDto): Promise<LaundryDocument> {
    const existingLaundry = await this.laundryModel.findOne(data);
    if (existingLaundry)
      throw new HttpException("같은 정보의 세탁기가 존재합니다.", 403);

    const laundry = new this.laundryModel(data);

    await laundry.save();

    return laundry;
  }

  async updateLaundryTimetable(
    data: CreateLaundryTimetableDto,
  ): Promise<LaundryTimetableDocument> {
    const laundry = await this.getLaundry(data.laundryId);

    const laundryTimetable = this.laundryTimetableModel.findOneAndUpdate(
      {
        laundry: laundry._id,
        type: data.type,
      },
      {
        $set: data,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return laundryTimetable;
  }

  async getStudentLaundryApplication(
    studentId: Types.ObjectId,
  ): Promise<LaundryApplicationDocument> {
    const student = await this.userManageService.getStudent(studentId);
    const laundryApplication = await this.laundryApplicationModel
      .findOne({
        student: student._id,
      })
      .populate({
        path: "timetable",
        populate: {
          path: "laundry",
        },
      });

    return laundryApplication;
  }

  async getLaundryTimetables(): Promise<LaundryTimetableDocument[]> {
    const laundries = await this.laundryTimetableModel
      .find()
      .populate("laundry");

    return laundries;
  }

  async getLaundryApplications(): Promise<LaundryApplicationDocument[]> {
    const type = await this.stayManageService.isStay();

    const timetables = await this.laundryTimetableModel
      .find({ type: type })
      .populate("laundry");

    const laundryTimetableIds = timetables.map((laundry) => laundry._id);

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteLaundryApplications(): Promise<LaundryApplicationDocument[]> {
    const laundryApplications = await this.laundryApplicationModel.find();
    await this.laundryApplicationModel.deleteMany();

    return laundryApplications;
  }
}
