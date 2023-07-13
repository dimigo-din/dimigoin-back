import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvent(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return this.eventService.uploadEvent(file);
  }
}
