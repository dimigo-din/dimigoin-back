import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { StayManageService } from "src/routes/stay/providers";

import { Event, EventDocument, StudentDocument } from "src/schemas";

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,

    private stayManageService: StayManageService,
  ) {}

  async getAllEvents(student: StudentDocument): Promise<EventDocument[]> {
    const isTodayStay = await this.stayManageService.isStay();

    return await this.eventModel.find({
      isStaySchedule: isTodayStay,
      grade: student.grade,
    });
  }
}
