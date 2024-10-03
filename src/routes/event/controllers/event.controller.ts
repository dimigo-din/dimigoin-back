import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { createOpertation } from "src/lib/utils";

import { EventDocument, StudentDocument } from "src/schemas";

import { GetAllEventResponseDto } from "../dto";
import { EventService } from "../providers";

@ApiTags("Event")
@Controller("event")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation(
    createOpertation({
      name: "이벤트",
      description: "Kinetic 아키텍쳐를 위한 시간 이벤트를 반환합니다.",
      studentOnly: true,
    }),
  )
  @ApiResponse({
    status: 200,
    type: GetAllEventResponseDto,
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getEvent(@Req() req: Request): Promise<EventDocument[]> {
    return await this.eventService.getAllEvents(req.user as StudentDocument);
  }
}
