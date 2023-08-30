import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Journal, JournalDocument } from "src/schemas";
import {
  CreateJournalDto,
  DeleteJournalDto,
  ManageJournal,
} from "../dto/journal.dto";

@Injectable()
export class JournalService {
  constructor(
    @InjectModel(Journal.name)
    private journalModel: Model<JournalDocument>,
  ) {}

  async getAllJournal(): Promise<JournalDocument[]> {
    const journals = await this.journalModel.find();
    return journals;
  }

  async getAllJournalByStudent(
    user: string | ObjectId,
  ): Promise<JournalDocument[]> {
    console.log(user);
    const journals = await this.journalModel.find({ user: user.toString() });
    console.log(journals);
    return journals;
  }

  async createJournal(data: CreateJournalDto): Promise<JournalDocument> {
    const journal = new this.journalModel({ ...data });

    await journal.save();

    return journal;
  }

  async manageJournal(data: ManageJournal): Promise<JournalDocument> {
    const journal = await this.journalModel.findById(data.journal);
    if (!journal)
      throw new HttpException("해당 생활지도사항이 존재하지 않습니다.", 404);

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
      throw new HttpException("해당 생활지도사항이 존재하지 않습니다.", 404);

    return journal;
  }
}
