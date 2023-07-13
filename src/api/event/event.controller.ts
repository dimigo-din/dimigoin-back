import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Event, StudentDocument } from 'src/common/schemas';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvent(@Req() req: Request): Promise<Event[]> {
    const user = req.user as StudentDocument;
    return this.eventService.getEvent(user.grade);
  }

  @Get('temp')
  async tempInsert(): Promise<any> {
    return this.eventService.tempInsert();
  }
}
