import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { TimetableDocument } from "src/schemas";

import { TimetableService } from "../providers";
@ApiTags("Timetable")
@Controller("timetable")
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @ApiOperation(
    createOpertation({
      name: "시간표",
      description: "해당하는 학년 반의 시간표를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard)
  @Get("/:grade/:class")
  async getTimetable(
    @Param("grade") _grade: number,
    @Param("class") _class: number,
  ): Promise<TimetableDocument[]> {
    return await this.timetableService.get(_grade, _class);
  }
}
