import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { GradeValues } from "src/common/types";
import { StayService } from "src/routes/stay/providers";

import { Event, EventDocument } from "src/schemas";

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,

    private stayService: StayService,
  ) {}

  async get(grade: keyof typeof GradeValues): Promise<EventDocument[]> {
    const isStay = await this.stayService.isStay();

    const events = await this.eventModel.find({
      type: isStay,
      grade: grade,
    });

    return events;
  }
}
