import {
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
  Patch,
  Controller,
} from "@nestjs/common";
import { Request } from "express";

import {
  DIMIJwtAuthGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from "src/auth/guards";

import { JournalDocument } from "src/schemas";

import {
  CreateJournalDto,
  DeleteJournalDto,
  GetJournalDto,
  ManageJournal,
} from "../dto";
import { JournalService } from "../providers";

@Controller("journal")
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get()
  async getAllJournal(): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournal();
  }

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("student")
  async getAllJournalByStudent(
    @Body() data: GetJournalDto,
  ): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournalByStudent(data.user);
  }

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Get("my")
  async getMyJournal(@Req() req: Request): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournalByStudent(req.user._id);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post()
  async createJournal(
    @Body() data: CreateJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalService.createJournal(data);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Patch()
  async manageJournal(@Body() data: ManageJournal): Promise<JournalDocument> {
    return await this.journalService.manageJournal(data);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete()
  async deleteJournal(
    @Body() data: DeleteJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalService.deleteJournal(data);
  }
}
