import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Journal, JournalDocument, StudentDocument } from "src/schemas";

import { JournalManageService } from "./journal.manage.service";

@Injectable()
export class JournalService {
  constructor(
    @InjectModel(Journal.name)
    private journalModel: Model<JournalDocument>,

    private journalManageService: JournalManageService,
  ) {}

  async get(student: StudentDocument): Promise<JournalDocument[]> {
    return this.journalManageService.get(student._id);
  }
}
