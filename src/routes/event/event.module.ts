import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, EventSchema } from "src/schemas";
import { EventService } from "./providers/event.service";
import { EventController } from "./controllers/event.controller";
import { StayModule } from "../stay/stay.module";

@Module({
  imports: [
    StayModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
