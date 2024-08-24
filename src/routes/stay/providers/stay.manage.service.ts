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

import { Grade, KorWeekDayValues } from "../../../common";
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
    const outgos = await this.stayOutgoModel.find().populate("student");
    const applications = (
      await this.stayApplicationModel
        .find({
          stay: stay._id,
        })
        .populate("student")
    ).map((application) => {
      const userOutgos = outgos
        .filter((outgo) => outgo.student._id.equals(application.student._id))
        .map((outgo) => {
          return {
            ...outgo.toJSON(),
            meal: {
              breakfast: !outgo.meal.breakfast,
              lunch: !outgo.meal.lunch,
              dinner: !outgo.meal.dinner,
            },
          };
        });
      return {
        ...application.toJSON(),
        outgo: userOutgos,
      };
    });

    return applications;
  }

  async downloadStayApplicationsExcel(
    stayId: Types.ObjectId,
    res,
    grade: Grade,
  ): Promise<void> {
    const stay = await this.getStay(stayId);
    const applications = (
      await this.stayApplicationModel
        .find({
          stay: stay._id,
        })
        .populate("student")
    ).filter((application: any) => application.student.grade === grade);
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
      this.addSheet(wb, grade, applications, outgosByDate[key], key);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        encodeURI(
          `${moment().year()}년도 ${moment().week()}주차 ${grade}학년 잔류 명단.xlsx`,
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

  async setStudentStayOutgoApprove(
    stayOutgoId: Types.ObjectId,
    approve: boolean,
  ): Promise<StayOutgoDocument> {
    const stayOutgo = await this.stayOutgoModel.findOneAndUpdate(
      {
        _id: stayOutgoId,
      },
      {
        $set: {
          status: approve ? "A" : "R",
        },
      },
    );
    if (!stayOutgo)
      throw new HttpException("해당 잔류외출 신청이 없습니다.", 404);

    return this.stayOutgoModel.findById(stayOutgoId).populate("student");
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

  addSheet(wb: WorkSheet, grade, applicationsRaw: any[], outgos: any[], day) {
    const stayDay = moment(day);
    const sheet = wb.addWorksheet(`${stayDay.format("yyyy년도 MM월 DD일")}`);

    const columnsStyle = {
      alignment: { horizontal: "center", vertical: "middle" },
    };

    sheet.getRow(2).values = [
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
      "비고",
    ];
    sheet.columns = [
      { header: "학년", key: "grade", width: 10, style: columnsStyle },
      { header: "반", key: "class", width: 10, style: columnsStyle },
      { header: "인원", key: "count", width: 10, style: columnsStyle },
      { header: "학번", key: "number", width: 10, style: columnsStyle },
      { header: "잔류자", key: "name", width: 20, style: columnsStyle },
      { header: "성별", key: "gender", width: 10, style: columnsStyle },
      { header: "조식", key: "breakfast", width: 10, style: columnsStyle },
      { header: "중식", key: "lunch", width: 10, style: columnsStyle },
      { header: "석식", key: "dinner", width: 10, style: columnsStyle },
      { header: "외출", key: "outgo", width: 50, style: columnsStyle },
      { header: "비고", key: "etc", width: 10, style: columnsStyle },
    ];

    const applications = applicationsRaw
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
      .map((application) => {
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

        const count = applicationsRaw.filter(
          (a) => a.student.class === application.student.class,
        ).length;
        const number = `${application.student.grade}${
          application.student.class
        }${this.pad(application.student.number, 2)}`;
        const gender = application.student.gender === "M" ? "남" : "여";
        return {
          grade: `${application.student.grade}학년`,
          class: `${application.student.class}반`,
          count,
          number,
          name: application.student.name,
          gender,
          breakfast: meal.breakfast ? "O" : "X",
          lunch: meal.lunch ? "O" : "X",
          dinner: meal.dinner ? "O" : "X",
          outgo: outgoMessage,
          etc: "",
        };
      });
    sheet.addRows(applications.flat());
    sheet.getCell(
      `A${applications.length + 3}`,
    ).value = `총원  ( ${applications.length}명 )`;

    // ================ Merge Cells ================ //
    sheet.mergeCells("A1:K1");
    sheet.mergeCells(`A3:A${applications.length + 2}`);
    sheet.mergeCells(`A${applications.length + 3}:C${applications.length + 3}`);
    sheet.mergeCells(`D${applications.length + 3}:K${applications.length + 3}`);

    let lastClass = "0";
    let lastPosition = 3;
    applications.forEach((application, i) => {
      if (lastClass === "0") lastClass = application.class;
      if (lastClass !== application.class || i === applications.length - 1) {
        if (i === applications.length - 1) i++;
        sheet.mergeCells(`B${lastPosition}:B${i + 2}`);
        sheet.mergeCells(`C${lastPosition}:C${i + 2}`);
        lastPosition = i + 2 + 1;
      }
      lastClass = application.class;
    });

    // ================ Header Cells ================ //
    sheet.getCell("A1").value = `${stayDay.format("yyyy년도 MM월 DD일")} ${
      KorWeekDayValues[stayDay.weekday()]
    }요일 ${grade}학년 잔류자 명단`;

    // ================ Style Cells ================ //
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        cell.font = {
          name: "맑은고딕",
          size: 12,
        };
      });
    });

    sheet.getCell("A1").font = {
      name: "맑은고딕",
      size: 16,
      bold: true,
    };
    const border = {
      top: {
        style: "thin",
        color: { argb: "FFED7D32" },
      },
      left: {
        style: "thin",
        color: { argb: "FFED7D32" },
      },
      bottom: {
        style: "thin",
        color: { argb: "FFED7D32" },
      },
      right: {
        style: "thin",
        color: { argb: "FFED7D32" },
      },
    };
    const fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE6D8" },
    };
    sheet.getCell("A1").border = border;
    sheet.getCell("A1").fill = fill;
    sheet.getCell.height = 25;
    const header = [
      "A2",
      "B2",
      "C2",
      "D2",
      "E2",
      "F2",
      "G2",
      "H2",
      "I2",
      "J2",
      "K2",
    ];
    const footer = [
      `A${applications.length + 3}`,
      `B${applications.length + 3}`,
      `C${applications.length + 3}`,
      `D${applications.length + 3}`,
      `E${applications.length + 3}`,
      `F${applications.length + 3}`,
      `G${applications.length + 3}`,
      `H${applications.length + 3}`,
      `I${applications.length + 3}`,
      `J${applications.length + 3}`,
      `K${applications.length + 3}`,
    ];
    header.forEach((h) => (sheet.getCell(h).border = border));
    header.forEach((h) => (sheet.getCell(h).fill = fill));
    footer.forEach((f) => (sheet.getCell(f).fill = fill));
    footer.forEach((f) => (sheet.getCell(f).fill = fill));
  }

  pad(num, size) {
    const s = "000000000" + num;
    return s.substring(s.length - size);
  }
}
