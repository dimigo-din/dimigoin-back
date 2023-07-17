import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/common/schemas';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { StayModule } from '../stay/stay.module';

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
