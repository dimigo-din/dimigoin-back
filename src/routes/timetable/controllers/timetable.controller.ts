import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { EditPermissionGuard } from "src/auth/guards";
import { TimetableService } from "../providers/timetable.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("timetable")
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @UseGuards(AuthGuard, EditPermissionGuard)
  @Get("/update")
  async updateTimetable(): Promise<any> {
    return await this.timetableService.updateTimetable();
  }

  @Get("/:grade/:class")
  async getTimetable(
    @Param("grade") _grade: number,
    @Param("class") _class: number,
  ): Promise<any> {
    return await this.timetableService.getTimetable(_grade, _class);
  }
}
