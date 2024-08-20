import { forwardRef, HttpException, Inject, Injectable } from "@nestjs/common";
import { callAppShutdownHook } from "@nestjs/core/hooks";
import { InjectModel } from "@nestjs/mongoose";
import * as Excel from "exceljs";
import moment from "moment";
import { Model, Types } from "mongoose";
import { WorkSheet } from "xlsx";

import {
  stringDateToMoment,
  stringDateTimeToMoment,
  momentToStringDate,
} from "src/common/utils";
import { UserManageService } from "src/routes/user/providers";

import {
  Stay,
  StayDocument,
  StayApplication,
  StayApplicationDocument,
  StayOutgo,
  StayOutgoDocument,
} from "src/schemas";

import { ApplyStayDto, ApplyStayOutgoDto, CreateStayDto } from "../dto";

@Injectable()
export class StayManageService {
  constructor(
    @InjectModel(Stay.name)
    private stayModel: Model<StayDocument>,

    @InjectModel(StayApplication.name)
    private stayApplicationModel: Model<StayApplicationDocument>,

    @InjectModel(StayOutgo.name)
    private stayOutgoModel: Model<StayOutgoDocument>,

    @Inject(forwardRef(() => UserManageService))
    private userManageService: UserManageService,
  ) {}

  async getStays(): Promise<StayDocument[]> {
    const stays = await this.stayModel.find();

    return stays;
  }

  async createStay(data: CreateStayDto): Promise<StayDocument> {
    const stay = new this.stayModel({
      current: false,
      ...data,
    });

    await stay.save();
    return stay;
  }

  async editStay(
    stayId: Types.ObjectId,
    data: CreateStayDto,
  ): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    for (const newKey of Object.keys(data)) {
      stay[newKey] = data[newKey];
    }

    await stay.save();
    return stay;
  }

  async deleteStay(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    await this.stayModel.findByIdAndDelete(stay._id);

    return stay;
  }

  async getStay(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.stayModel.findById(stayId);
    if (!stay) throw new HttpException("해당 잔류 일정이 없습니다.", 404);

    return stay;
  }

  async getStayApplications(
    stayId: Types.ObjectId,
  ): Promise<StayApplicationDocument[]> {
    const stay = await this.getStay(stayId);
    const applications = await this.stayApplicationModel
      .find({
        stay: stay._id,
      })
      .populate("student");

    return applications;
  }

  async downloadStayApplicationsExcel(
    stayId: Types.ObjectId,
    res,
  ): Promise<void> {
    const stay = await this.getStay(stayId);
    const applications = await this.stayApplicationModel
      .find({
        stay: stay._id,
      })
      .populate("student");
    const outgos = await this.stayOutgoModel
      .find({
        stay: stay._id,
      })
      .sort({ date: 1 })
      .populate("stay")
      .populate("student");

    const outgosByDate: { [key: string]: StayOutgo[] } = {};
    outgos.forEach((outgo) => {
      if (!outgosByDate.hasOwnProperty(outgo.date))
        outgosByDate[outgo.date] = [];
      outgosByDate[outgo.date].push(outgo);
    });

    const wb = new Excel.Workbook();
    Object.keys(outgosByDate).forEach((key) => {
      this.addSheet(wb, applications, outgosByDate[key], key);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        encodeURI(
          `${moment().year()}년도 ${moment().week()}주차 잔류 명단.xlsx`,
        ),
    );

    await wb.xlsx.write(res);
  }

  async getCurrentStay(): Promise<StayDocument> {
    const stay = await this.stayModel.findOne({ current: true });
    if (!stay) throw new HttpException("활성화된 잔류가 없습니다.", 404);

    return stay;
  }

  async setCurrentStay(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.getStay(stayId);
    const currentStay = await this.stayModel.findOne({ current: true });
    if (currentStay) {
      currentStay.current = false;
      await currentStay.save();
    }

    stay.current = true;

    await stay.save();
    return stay;
  }

  async deleteCurrentStay(stayId: Types.ObjectId): Promise<StayDocument> {
    const stay = await this.getStay(stayId);

    stay.current = false;

    await stay.save();
    return stay;
  }

  async getStudentStayApplication(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
  ): Promise<StayApplicationDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userManageService.getStudent(studentId);

    const application = await this.stayApplicationModel
      .findOne({
        stay: stay._id,
        student: student._id,
      })
      .populate("stay")
      .populate("student");

    return application;
  }

  async applyStudentStay(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
    data: ApplyStayDto,
  ): Promise<StayApplicationDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userManageService.getStudent(studentId);

    if (!stay.seat[student.gender + student.grade].includes(data.seat))
      throw new HttpException("해당 학년이 신청 가능한 좌석이 아닙니다.", 403);

    const existingApplication = await this.stayApplicationModel.findOne({
      stay: stay._id,
      student: student._id,
    });
    if (existingApplication)
      throw new HttpException("이미 잔류를 신청했습니다.", 403);

    const existingSeat = await this.stayApplicationModel.findOne({
      stay: stay._id,
      seat: data.seat,
    });
    if (existingSeat && existingSeat.seat !== "NONE")
      throw new HttpException("이미 신청된 좌석입니다.", 403);

    if (data.seat === "NONE" && !data.reason)
      throw new HttpException("미선택 사유를 입력해주세요.", 403);
    if (data.seat !== "NONE") delete data.reason;

    const application = new this.stayApplicationModel({
      stay: stay._id,
      student: student._id,
      ...data,
    });

    await application.save();
    return application;
  }

  async cancelStudentStay(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
  ): Promise<StayApplicationDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userManageService.getStudent(studentId);

    const application = await this.stayApplicationModel.findOneAndDelete({
      stay: stay._id,
      student: student._id,
    });
    if (!application)
      throw new HttpException("취소할 잔류신청이 없습니다.", 404);

    await this.stayOutgoModel.deleteMany({ student: studentId });

    return application;
  }

  async getStudetnStayOutgos(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
  ): Promise<StayOutgoDocument[]> {
    const stay = await this.getStay(stayId);
    const student = await this.userManageService.getStudent(studentId);

    const outgos = await this.stayOutgoModel
      .find({
        stay: stay._id,
        student: student._id,
      })
      .sort({ date: 1 })
      .populate("stay")
      .populate("student");

    return outgos;
  }

  async applyStudentStayOutgo(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
    application: ApplyStayOutgoDto,
  ): Promise<StayOutgoDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userManageService.getStudent(studentId);

    const stayApplication = await this.stayApplicationModel.findOne({
      stay: stay._id,
      student: student._id,
    });
    if (!stayApplication)
      throw new HttpException("잔류를 신청하지 않았습니다.", 403);

    const applicationDate = stringDateToMoment(application.date);
    const applicationStart = stringDateTimeToMoment(application.duration.start);
    const applicationEnd = stringDateTimeToMoment(application.duration.end);

    const targetStayOutgo = stay.dates.find((stayDate) =>
      stringDateToMoment(stayDate.date).isSame(applicationDate),
    );
    if (!targetStayOutgo)
      throw new HttpException("올바른 잔류외출 신청이 아닙니다.", 404);

    if (application.free) {
      if (!targetStayOutgo.free)
        throw new HttpException(
          "해당 날짜는 자기개발 외출이 불가능합니다.",
          403,
        );

      const existingStayOutgoFree = await this.stayOutgoModel.findOne({
        stay: stay._id,
        student: student._id,
        date: momentToStringDate(applicationDate),
        free: true,
      });
      if (existingStayOutgoFree)
        throw new HttpException("이미 자기개발 외출을 신청했습니다.", 403);

      const mealLunch = application.meal.lunch;
      delete application["duration"];
      delete application["reason"];
      delete application["meal"];

      const stayOutgo = new this.stayOutgoModel({
        stay: stay._id,
        student: student._id,
        status: "A",
        ...application,
        meal: {
          breakfast: false,
          lunch: mealLunch,
          dinner: false,
        },
      });

      await stayOutgo.save();
      return stayOutgo;
    } else {
      const targetStayOutgoStart = stringDateToMoment(
        targetStayOutgo.date,
      ).startOf("day");
      const targetStayOutgoEnd = stringDateToMoment(targetStayOutgo.date).endOf(
        "day",
      );

      if (
        !applicationStart.isBetween(targetStayOutgoStart, targetStayOutgoEnd) ||
        !applicationEnd.isBetween(targetStayOutgoStart, targetStayOutgoEnd) ||
        applicationEnd.isBefore(applicationStart)
      )
        throw new HttpException("올바른 잔류외출 신청이 아닙니다.", 404);

      const stayOutgo = new this.stayOutgoModel({
        stay: stay._id,
        student: student._id,
        status: "W",
        ...application,
      });

      await stayOutgo.save();
      return stayOutgo;
    }
  }

  async cancelStudentStayOutgo(
    studentId: Types.ObjectId,
    stayId: Types.ObjectId,
    stayOutgoId: Types.ObjectId,
  ): Promise<StayOutgoDocument> {
    const stay = await this.getStay(stayId);
    const student = await this.userManageService.getStudent(studentId);

    const stayOutgo = await this.stayOutgoModel.findOneAndDelete({
      _id: stayOutgoId,
      stay: stay._id,
      student: student._id,
    });
    if (!stayOutgo)
      throw new HttpException("해당 잔류외출 신청이 없습니다.", 404);

    return stayOutgo;
  }

  async isStay(): Promise<number> {
    const today = momentToStringDate(moment());
    const stay = await this.stayModel.findOne({
      dates: {
        $elemMatch: {
          date: today,
        },
      },
    });

    return stay ? 1 : 0;
  }

  addSheet(wb: WorkSheet, applications: any[], outgos: any[], day) {
    const stayDay = moment(day);
    const sheet = wb.addWorksheet(
      `${stayDay.format("yyyy년도 MM월 DD일")} 잔류자 명단`,
    );

    sheet.addRow([
      "학년",
      "반",
      "인원",
      "학번",
      "잔류자",
      "성별",
      "조식",
      "중식",
      "석식",
      "외출",
    ]);

    let lastStart1 = 2; // for grade
    let lastStart2 = 2; // for class
    let lastGrade = "";
    let lastClass = "";
    let studentCountGrade = 0;
    let studentCountClass = 0;
    applications
      .sort(
        (a1, a2) =>
          parseInt(
            `${a1.student.grade}${a1.student.class}${this.pad(
              a1.student.number,
              2,
            )}`,
          ) -
          parseInt(
            `${a2.student.grade}${a2.student.class}${this.pad(
              a2.student.number,
              2,
            )}`,
          ),
      )
      .forEach((application, i) => {
        const outgo = outgos.filter((outgo) =>
          outgo.student._id.equals(application.student._id),
        );

        const meal = { breakfast: true, lunch: true, dinner: true };
        let outgoMessage = "";
        outgo.forEach((out) => {
          meal.breakfast = out.meal.breakfast ? false : meal.breakfast;
          meal.lunch = out.meal.lunch ? false : meal.lunch;
          meal.dinner = out.meal.dinner ? false : meal.dinner;
          outgoMessage += out.free
            ? "자기개발외출(10:20~14:00)"
            : `${out.reason}(${moment(
                out.duration.start,
                "yyyy-MM-DD HH:mm:ss",
              ).format("HH:mm")}~${moment(
                out.duration.end,
                "yyyy-MM-DD HH:mm:ss",
              ).format("HH:mm")})`;
        });

        sheet.getCell(`A${i + 2}`).value = application.student.grade;
        sheet.getCell(`B${i + 2}`).value = application.student.class;
        sheet.getCell(`D${i + 2}`).value = `${application.student.grade}${
          application.student.class
        }${this.pad(application.student.number, 2)}`;
        sheet.getCell(`E${i + 2}`).value = application.student.name;
        sheet.getCell(`F${i + 2}`).value = application.student.gender;
        sheet.getCell(`G${i + 2}`).value = meal.breakfast ? "O" : "X";
        sheet.getCell(`H${i + 2}`).value = meal.lunch ? "O" : "X";
        sheet.getCell(`I${i + 2}`).value = meal.dinner ? "O" : "X";
        sheet.getCell(`J${i + 2}`).value = outgoMessage;

        studentCountClass++;
        studentCountGrade++;

        let gradeEnd = false;
        if (
          (lastGrade !== `${application.student.grade}` && lastGrade !== "") ||
          i === applications.length - 1
        ) {
          // sheet.getCell(`C${i + 1}`).value = "총원";
          // sheet.getCell(`D${i + 1}`).value = studentCountGrade;
          // studentCountGrade = 0;
          // i++;

          sheet.mergeCells(
            `A${lastStart1}:A${i === applications.length - 1 ? i + 2 : i + 1}`,
          );
          lastStart1 = i + 2;
          gradeEnd = true;
        }

        if (
          (lastClass !==
            `${application.student.grade}${application.student.class}` &&
            lastClass !== "") ||
          i === applications.length - 1
        ) {
          sheet.mergeCells(
            `B${lastStart2}:B${i === applications.length - 1 ? i + 2 : i + 1}`,
          );
          sheet.mergeCells(
            `C${lastStart2}:C${i === applications.length - 1 ? i + 2 : i + 1}`,
          );
          sheet.getCell(`C${i + 1}`).value = studentCountClass;
          lastStart2 = i + 2;
          studentCountClass = 0;
        }

        lastGrade = `${application.student.grade}`;
        lastClass = `${application.student.grade}${application.student.class}`;
      });

    // 가운데 정렬
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      });
    });

    // 셀 넓이 자동
    sheet.columns.forEach(function (column) {
      let maxLength = 0;
      column["eachCell"]!({ includeEmpty: true }, function (cell) {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength;
    });
  }

  pad(num, size) {
    const s = "000000000" + num;
    return s.substring(s.length - size);
  }
}
