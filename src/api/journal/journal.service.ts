import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Journal, JournalDocument } from 'src/common/schemas';
import {
  CreateJournalDto,
  DeleteJournalDto,
  ManageJournal,
} from 'src/common/dto';

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

  async getAllJournalByStudent(user: string): Promise<JournalDocument[]> {
    const journals = await this.journalModel.find({ user: user });
    return journals;
  }

  async createJournal(data: CreateJournalDto): Promise<JournalDocument> {
    const journal = new this.journalModel({ ...data });

    await journal.save();

    return journal;
  }

  async manageJournal(data: ManageJournal): Promise<JournalDocument> {
    const journal = await this.journalModel.findById(data.journal);
    if (!journal) throw new HttpException('해당 생활지도사항이 존재하지 않습니다.', 404);

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

    if (!journal) throw new HttpException('해당 생활지도사항이 존재하지 않습니다.', 404);

    return journal;
  }
}
