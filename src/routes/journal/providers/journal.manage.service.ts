import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { UserManageService } from "src/routes/user/providers";

import { Journal, JournalDocument } from "src/schemas";

import { CreateJournalDto } from "../dto";

@Injectable()
export class JournalManageService {
  constructor(
    @InjectModel(Journal.name)
    private journalModel: Model<JournalDocument>,

    private userManageService: UserManageService,
  ) {}

  async getStudentJournals(
    studentId: Types.ObjectId,
  ): Promise<JournalDocument[]> {
    const student = await this.userManageService.getStudent(studentId);
    const journals = await this.journalModel
      .find({ student: student._id })
      .sort({ date: -1 });

    return journals;
  }

  async createStudentJournal(
    studentId: Types.ObjectId,
    data: CreateJournalDto,
  ): Promise<JournalDocument> {
    const student = await this.userManageService.getStudent(studentId);
    const journal = new this.journalModel({ student: student._id, ...data });

    await journal.save();

    return journal;
  }

  async editStudentJournal(
    journalId: Types.ObjectId,
    data: CreateJournalDto,
  ): Promise<JournalDocument> {
    const journal = await this.journalModel.findById(journalId);
    if (!journal)
      throw new HttpException("해당 지도사항이 존재하지 않습니다.", 404);

    for (const newKey of Object.keys(data)) {
      journal[newKey] = data[newKey];
    }

    await journal.save();

    return journal;
  }

  async deleteStudentJournal(
    journalId: Types.ObjectId,
  ): Promise<JournalDocument> {
    const journal = await this.journalModel.findByIdAndDelete(journalId);
    if (!journal)
      throw new HttpException("해당 지도사항이 존재하지 않습니다.", 404);

    return journal;
  }
}
