import { Get, Post, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JournalService } from './journal.service';
import { Journal, JournalDocument } from 'src/common/schemas';
import {
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from 'src/common/guard';
import {
  CreateJournalDto,
  DeleteJournalDto,
  GetJournalDto,
  ManageJournal,
} from 'src/common/dto';
import { Request } from 'express';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @UseGuards(ViewPermissionGuard)
  @Get()
  async getAllJournal(): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournal();
  }

  @UseGuards(ViewPermissionGuard)
  @Get('student')
  async getAllJournalByStudent(@Body() data: GetJournalDto): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournalByStudent(data.user);
  }

  @UseGuards(StudentOnlyGuard)
  @Get('my')
  async getMyJournal(@Req() req: Request): Promise<JournalDocument[]> {
    return await this.journalService.getAllJournalByStudent(req.user._id);
  }

  @UseGuards(EditPermissionGuard)
  @Post()
  async createJournal(@Body() data: CreateJournalDto): Promise<JournalDocument> {
    return await this.journalService.createJournal(data);
  }

  @UseGuards(EditPermissionGuard)
  @Post('manage')
  async manageJournal(@Body() data: ManageJournal): Promise<JournalDocument> {
    return await this.journalService.manageJournal(data);
  }

  @UseGuards(EditPermissionGuard)
  @Delete()
  async deleteJournal(@Body() data: DeleteJournalDto): Promise<JournalDocument> {
    return await this.journalService.deleteJournal(data);
  }
}
