import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Timetable, TimetableSchema } from 'src/common/schemas';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Timetable.name,
        schema: TimetableSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule {}
