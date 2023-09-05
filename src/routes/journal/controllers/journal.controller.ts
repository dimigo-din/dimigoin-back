import { Get, UseGuards, Req, Controller } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { JournalDocument, StudentDocument } from "src/schemas";

import { JournalService } from "../providers";

@ApiTags("Journal")
@Controller("journal")
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @ApiOperation(
    createOpertation({
      name: "지도일지",
      description: "자신의 지도일지를 가져옵니다.",
      studentOnly: true,
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getJournals(@Req() req: Request): Promise<JournalDocument[]> {
    return await this.journalService.getJournals(req.user as StudentDocument);
  }
}
