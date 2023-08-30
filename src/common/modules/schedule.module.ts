import { ScheduleModule } from "@nestjs/schedule";
import { Module } from "@nestjs/common";

@Module({ imports: [ScheduleModule.forRoot()] })
export class DIMIScheduleModule {}
