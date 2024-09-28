import { HttpException, Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Excel from "exceljs";
import moment from "moment/moment";
import { Model, Types } from "mongoose";
import { WorkSheet } from "xlsx";

import { UserManageService } from "src/routes/user/providers";

import { GradeValues, KorWeekDayValues } from "src/lib";

import {
  Frigo,
  FrigoDocument,
  FrigoApplication,
  FrigoApplicationDocument,
  StudentDocument,
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
    return await this.frigoModel.find({ deleted: false });
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
    frigo.current = false;
    frigo.deleted = true;
    await frigo.save();

    return frigo;
  }

  async getCurrentFrigo(): Promise<FrigoDocument> {
    const frigo = await this.frigoModel.findOne({
      current: true,
      deleted: false,
    });
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

  async downloadStudentFrigoApplications(res, frigoId: Types.ObjectId) {
    const frigo = await this.frigoModel.findById(frigoId);
    const frigoList = await this.frigoApplicationModel
      .find({
        frigo: frigoId,
        status: "A",
      })
      .populate("student");

    if (frigoList.length === 0)
      throw new HttpException("승인된 금요귀가 목록이 없습니다.", 404);

    const wb = new Excel.Workbook();
    GradeValues.forEach((grade) => {
      if (
        frigoList.find(
          (frigo) =>
            (frigo.student as unknown as StudentDocument).grade === grade,
        )
      )
        this.addSheet(
          wb,
          grade,
          frigoList.filter(
            (frigo) =>
              (frigo.student as unknown as StudentDocument).grade === grade,
          ),
          frigo.date,
        );
    });

    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        encodeURI(
          `${moment().year()}년도 ${moment().week()}주차 금요귀가 명단.xlsx`,
        ),
    );

    await wb.xlsx.write(res);
  }

  async applyStudentFrigo(
    frigo: Types.ObjectId,
    studentId: Types.ObjectId,
    reason: string,
  ) {
    const existingApplication = await this.frigoApplicationModel.findOne({
      frigo: frigo,
      student: studentId,
    });
    if (existingApplication)
      throw new HttpException("이미 금요귀가를 신청했습니다.", 403);

    if (reason.indexOf("/") === -1) {
      throw new HttpException(
        "사유는 [사유/귀가시간] 형식으로 대괄호 없이 기입해주세요.",
        400,
      );
    }

    const application = await new this.frigoApplicationModel({
      frigo: frigo,
      student: studentId,
      reason,
      status: "A",
    }).save();

    return application;
  }

  async cancelStudentFrigo(frigo: Types.ObjectId, student: Types.ObjectId) {
    const application = await this.frigoApplicationModel.findOneAndDelete({
      frigo,
      student,
    });
    if (!application)
      throw new HttpException("해당 금요귀가 신청을 찾을 수 없습니다.", 404);

    return this.frigoApplicationModel.findOne({ frigo, student });
  }

  async setStudentFrigoApprove(
    frigo: Types.ObjectId,
    student: Types.ObjectId,
    approve: boolean,
  ) {
    const currentStatus = (
      await this.frigoApplicationModel.findOne({ frigo, student })
    ).status;
    const frigoApplication = await this.frigoApplicationModel.findOneAndUpdate(
      { frigo, student },
      {
        $set: {
          status:
            (approve ? "A" : "R") === currentStatus ? "W" : approve ? "A" : "R",
        },
      },
    );
    if (!frigoApplication)
      throw new HttpException("해당 금요귀가 신청이 없습니다.", 404);

    return this.frigoApplicationModel
      .findById(frigoApplication._id)
      .populate("frigo")
      .populate("student");
  }

  addSheet(wb: WorkSheet, grade, applicationsRaw: any[], day) {
    const frigoDay = moment(day);
    const sheet = wb.addWorksheet(`${grade}학년`);

    const columnsStyle = {
      alignment: { horizontal: "center", vertical: "middle" },
    };

    sheet.getRow(2).values = [
      "학년",
      "반",
      "인원",
      "학번",
      "성별",
      "이름",
      "귀가시간",
      "귀가사유",
      "비고",
    ];
    sheet.columns = [
      { header: "학년", key: "grade", width: 10, style: columnsStyle },
      { header: "반", key: "class", width: 10, style: columnsStyle },
      { header: "인원", key: "count", width: 10, style: columnsStyle },
      { header: "학번", key: "number", width: 10, style: columnsStyle },
      { header: "성별", key: "gender", width: 10, style: columnsStyle },
      { header: "이름", key: "name", width: 20, style: columnsStyle },
      { header: "귀가시간", key: "time", width: 25, style: columnsStyle },
      { header: "귀가사유", key: "reason", width: 30, style: columnsStyle },
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
          gender,
          name: application.student.name,
          time: application.reason.split("/")[1],
          reason: application.reason.split("/")[0],
          etc: "",
        };
      });
    sheet.addRows(applications.flat());
    sheet.getCell(
      `A${applications.length + 3}`,
    ).value = `총원  ( ${applications.length}명 )`;

    // ================ Merge Cells ================ //
    sheet.mergeCells("A1:I1");
    sheet.mergeCells(`A3:A${applications.length + 2}`);
    sheet.mergeCells(`A${applications.length + 3}:C${applications.length + 3}`);
    sheet.mergeCells(`D${applications.length + 3}:I${applications.length + 3}`);

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
    sheet.getCell("A1").value = `${frigoDay.format("yyyy년도 MM월 DD일")} ${
      KorWeekDayValues[frigoDay.weekday()]
    }요일 ${grade}학년 금요귀가 명단`;

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
    const header = ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2"];
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
