import { Get, Post, Body, UseGuards, Req, Delete } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JournalService } from './journal.service';
import { Journal } from 'src/common/schemas';
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
  getAllJournal(): Promise<Journal[]> {
    return this.journalService.getAllJournal();
  }

  @UseGuards(ViewPermissionGuard)
  @Get('student')
  getAllJournalByStudent(@Body() data: GetJournalDto): Promise<Journal[]> {
    return this.journalService.getAllJournalByStudent(data.user);
  }

  @UseGuards(StudentOnlyGuard)
  @Get('my')
  getMyJournal(@Req() req: Request): Promise<Journal[]> {
    return this.journalService.getAllJournalByStudent(req.user._id);
  }

  @UseGuards(EditPermissionGuard)
  @Post()
  createJournal(@Body() data: CreateJournalDto): Promise<Journal> {
    return this.journalService.createJournal(data);
  }

  @UseGuards(EditPermissionGuard)
  @Post('manage')
  manageJournal(@Body() data: ManageJournal): Promise<Journal> {
    return this.journalService.manageJournal(data);
  }

  @UseGuards(EditPermissionGuard)
  @Delete()
  deleteJournal(@Body() data: DeleteJournalDto): Promise<Journal> {
    return this.journalService.deleteJournal(data);
  }
}
