import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { DIMIJwtAuthGuard, EditPermissionGuard } from "src/auth/guards";
import { TimetableService } from "../providers/timetable.service";

@Controller("timetable")
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Get("/update")
  async updateTimetable(): Promise<any> {
    return await this.timetableService.updateTimetable();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/:grade/:class")
  async getTimetable(
    @Param("grade") _grade: number,
    @Param("class") _class: number,
  ): Promise<any> {
    return await this.timetableService.getTimetable(_grade, _class);
  }
}
