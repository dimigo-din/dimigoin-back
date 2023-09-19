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
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Types } from "mongoose";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
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
  @ApiParam({
    required: true,
    name: "studentId",
    description: "학생의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/:studentId")
  async getStudentJournals(
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
  ): Promise<JournalDocument[]> {
    return await this.journalManageService.getStudentJournals(studentId);
  }

  @ApiOperation(
    createOpertation({
      name: "학생 지도일지 생성",
      description: "해당하는 학생의 지도일지를 생성합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "studentId",
    description: "학생의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post("/:studentId")
  async createStudentJournal(
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() data: CreateJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalManageService.createStudentJournal(
      studentId,
      data,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "지도일지 수정",
      description: "해당하는 지도일지를 수정합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "journalId",
    description: "지도일지의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Put("/:journalId")
  async editStudentJournal(
    @Param("journalId", ObjectIdPipe) journalId: Types.ObjectId,
    @Body() data: CreateJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalManageService.editStudentJournal(journalId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "지도일지 삭제",
      description: "해당하는 지도일지를 삭제합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "journalId",
    description: "지도일지의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/:journalId")
  async deleteStudentJournal(
    @Param("journalId", ObjectIdPipe) journalId: Types.ObjectId,
  ): Promise<JournalDocument> {
    return await this.journalManageService.deleteStudentJournal(journalId);
  }
}
