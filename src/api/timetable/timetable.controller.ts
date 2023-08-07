import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { EditPermissionGuard } from 'src/common/guard';
import { Timetable } from 'src/common/schemas';
import { TimetableService } from './timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Get('/:grade/:class')
  async getTimetable(
    @Param('grade') _grade: number,
    @Param('class') _class: number,
  ): Promise<any> {
    return this.timetableService.getTimetable(_grade, _class);
  }

  @UseGuards(EditPermissionGuard)
  @Get('/update')
  async updateTimetable(): Promise<any> {
    return this.timetableService.updateTimetable();
  }
}
