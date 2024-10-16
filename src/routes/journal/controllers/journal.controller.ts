import { Get, UseGuards, Req, Controller } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import { Journal, JournalDocument, StudentDocument } from "src/schemas";

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
  @ApiResponse({
    status: 200,
    type: [Journal],
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getJournals(@Req() req: Request): Promise<JournalDocument[]> {
    return await this.journalService.getJournals(req.user as StudentDocument);
  }
}
