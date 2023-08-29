import { Get, Post, Body, UseGuards, Req, Delete } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { JournalService } from "../providers/journal.service";
import { JournalDocument } from "src/schemas";
import {
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from "src/auth/guards";
import {
  CreateJournalDto,
  DeleteJournalDto,
  GetJournalDto,
  ManageJournal,
} from "../dto/journal.dto";
import { Request } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("journal")
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @UseGuards(AuthGuard("jwt"), ViewPermissionGuard)
  @Get()
  async getAllJournal(): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournal();
  }

  @UseGuards(AuthGuard("jwt"), ViewPermissionGuard)
  @Get("student")
  async getAllJournalByStudent(
    @Body() data: GetJournalDto,
  ): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournalByStudent(data.user);
  }

  @UseGuards(AuthGuard("jwt"), StudentOnlyGuard)
  @Get("my")
  async getMyJournal(@Req() req: Request): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournalByStudent(req.user._id);
  }

  @UseGuards(AuthGuard("jwt"), EditPermissionGuard)
  @Post()
  async createJournal(
    @Body() data: CreateJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalService.createJournal(data);
  }

  @UseGuards(AuthGuard("jwt"), EditPermissionGuard)
  @Post("manage")
  async manageJournal(@Body() data: ManageJournal): Promise<JournalDocument> {
    return await this.journalService.manageJournal(data);
  }

  @UseGuards(AuthGuard("jwt"), EditPermissionGuard)
  @Delete()
  async deleteJournal(
    @Body() data: DeleteJournalDto,
  ): Promise<JournalDocument> {
    return await this.journalService.deleteJournal(data);
  }
}
