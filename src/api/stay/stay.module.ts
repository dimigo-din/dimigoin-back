import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Stay,
  StaySchema,
  StayApplication,
  StayApplicationSchema,
  StayOutgo,
  StayOutgoSchema,
} from 'src/common/schemas';
import { StayService } from './stay.service';
import { StayController } from './stay.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stay.name, schema: StaySchema }]),
    MongooseModule.forFeature([{ name: StayApplication.name, schema: StayApplicationSchema }]),
    MongooseModule.forFeature([{ name: StayOutgo.name, schema: StayOutgoSchema }]),
  ],
  controllers: [StayController],
  providers: [StayService],
  exports: [StayService],
})
export class StayModule {}
