import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

import { DIMIJwtAuthGuard } from "src/auth/guards";
import { GradeType, ClassType } from "src/lib/types";
import { createOpertation } from "src/lib/utils";

import { Timetable, TimetableDocument } from "src/schemas";

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
  @ApiResponse({
    status: 200,
    type: [Timetable],
  })
  @ApiParam({
    required: true,
    name: "grade",
    description: "학년",
    type: Number,
  })
  @ApiParam({
    required: true,
    name: "class",
    description: "반",
    type: Number,
  })
  @UseGuards(DIMIJwtAuthGuard)
  @Get("/:grade/:class")
  async getTimetable(
    @Param("grade") _grade: GradeType,
    @Param("class") _class: ClassType,
  ): Promise<TimetableDocument[]> {
    return await this.timetableService.getTimetable(_grade, _class);
  }
}
