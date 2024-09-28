import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import { EventDocument, StudentDocument } from "src/schemas";

import { GetEventResponse } from "../dto";
import { EventService } from "../providers";

@ApiTags("Event")
@Controller("event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation(
    createOpertation({
      name: "이벤트",
      description: "이벤트를 반환합니다.",
      studentOnly: true,
    }),
  )
  @ApiResponse({
    status: 200,
    type: GetEventResponse,
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getEvent(@Req() req: Request): Promise<{
    events: EventDocument[];
    isStaySchedule: boolean;
  }> {
    const student = req.user as StudentDocument;

    return await this.eventService.getEvents(student.grade);
  }
}
