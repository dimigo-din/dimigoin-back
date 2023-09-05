import { Injectable } from "@nestjs/common";

import { JournalDocument, StudentDocument } from "src/schemas";

import { JournalManageService } from "./journal.manage.service";

@Injectable()
export class JournalService {
  constructor(private journalManageService: JournalManageService) {}

  async getJournals(student: StudentDocument): Promise<JournalDocument[]> {
    const journals = this.journalManageService.getStudentJournals(student._id);

    return journals;
  }
}
