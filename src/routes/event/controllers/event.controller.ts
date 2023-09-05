import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";
import { StayService } from "src/routes/stay/providers";

import { EventDocument, StudentDocument } from "src/schemas";

import { EventService } from "../providers";

@ApiTags("Event")
@Controller("event")
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly stayService: StayService,
  ) {}

  @ApiOperation(
    createOpertation({
      name: "이벤트",
      description: "이벤트를 반환합니다.",
      studentOnly: true,
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getEvent(@Req() req: Request): Promise<{
    events: EventDocument[];
    type: number;
  }> {
    const student = req.user as StudentDocument;

    return await this.eventService.getEvents(student.grade);
  }
}
