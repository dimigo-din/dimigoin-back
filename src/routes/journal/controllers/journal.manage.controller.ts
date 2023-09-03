import {
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Put,
  Controller,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Types } from "mongoose";

import {
  DIMIJwtAuthGuard,
  EditPermissionGuard,
  ViewPermissionGuard,
} from "src/auth/guards";
import { ObjectIdPipe } from "src/common/pipes";
import { createOpertation } from "src/common/utils";

import { JournalDocument } from "src/schemas";

import { CreateJournalDto } from "../dto";
import { JournalManageService } from "../providers";

@ApiTags("Journal Manage")
@Controller("manage/journal")
export class JournalManageController {
  constructor(private readonly journalManageService: JournalManageService) {}

  @ApiOperation(
    createOpertation({
      name: "학생 지도일지",
      description: "해당하는 학생의 지도일지를 가져옵니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/:studentId")
  async getJournal(
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
  ): Promise<JournalDocument[]> {
    return await this.journalManageService.get(studentId);
  }

  @ApiOperation(
    createOpertation({
      name: "학생 지도일지 생성",
      description: "해당하는 학생의 지도일지를 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("/:studentId")
  async createJournal(
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() data: CreateJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalManageService.create(studentId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "지도일지 수정",
      description: "해당하는 지도일지를 수정합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Put("/:journalId")
  async editJournal(
    @Param("journalId", ObjectIdPipe) journalId: Types.ObjectId,
    @Body() data: CreateJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalManageService.edit(journalId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "지도일지 삭제",
      description: "해당하는 지도일지를 삭제합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("/:journalId")
  async deleteJournal(
    @Param("journalId", ObjectIdPipe) journalId: Types.ObjectId,
  ): Promise<JournalDocument> {
    return await this.journalManageService.delete(journalId);
  }
}
