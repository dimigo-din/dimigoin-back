import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { UserService } from "src/routes/user/providers";

import { Journal, JournalDocument } from "src/schemas";

import { CreateJournalDto, DeleteJournalDto, ManageJournal } from "../dto";

@Injectable()
export class JournalManageService {
  constructor(
    @InjectModel(Journal.name)
    private journalModel: Model<JournalDocument>,

    private userService: UserService,
  ) {}

  async get(studentId: Types.ObjectId): Promise<JournalDocument[]> {
    const student = await this.userService.getStudent(studentId);
    const journals = await this.journalModel
      .find({ user: student._id })
      .sort({ date: -1 });

    return journals;
  }

  async create(
    studentId: Types.ObjectId,
    data: CreateJournalDto,
  ): Promise<JournalDocument> {
    const student = await this.userService.getStudent(studentId);
    const journal = new this.journalModel({ user: student._id, ...data });

    await journal.save();

    return journal;
  }

  async edit(
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

  async delete(journalId: Types.ObjectId): Promise<JournalDocument> {
    const journal = await this.journalModel.findByIdAndDelete(journalId);
    if (!journal)
      throw new HttpException("해당 지도사항이 존재하지 않습니다.", 404);

    return journal;
  }

  async manageJournal(data: ManageJournal): Promise<JournalDocument> {
    const journal = await this.journalModel.findById(data.journal);
    if (!journal)
      throw new HttpException("해당 지도사항이 존재하지 않습니다.", 404);

    journal.title = data.title;
    journal.date = data.date;
    journal.type = data.type;

    await journal.save();

    return journal;
  }

  async deleteJournal(data: DeleteJournalDto): Promise<JournalDocument> {
    const journal = await this.journalModel
      .findByIdAndDelete(data.journal)
      .lean();

    if (!journal)
      throw new HttpException("해당 지도사항이 존재하지 않습니다.", 404);

    return journal;
  }
}
