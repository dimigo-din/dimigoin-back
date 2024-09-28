import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GradeValues } from "src/lib/types";
import { StayManageService } from "src/routes/stay/providers";

import { Event, EventDocument } from "src/schemas";

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,

    private stayManageService: StayManageService,
  ) {}

  async getEvents(grade: keyof typeof GradeValues): Promise<{
    events: EventDocument[];
    type: number;
  }> {
    const isStay = await this.stayManageService.isStay();

    const events = await this.eventModel.find({
      type: isStay,
      grade: grade,
    });

    return {
      events,
      type: isStay,
    };
  }
}
