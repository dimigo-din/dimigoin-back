import { forwardRef, Module } from '@nestjs/common';
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
    MongooseModule.forFeature([
      { name: Stay.name, schema: StaySchema },
      { name: StayApplication.name, schema: StayApplicationSchema },
      { name: StayOutgo.name, schema: StayOutgoSchema }
    ]),
    forwardRef(() => StayModule),
  ],
  controllers: [StayController],
  providers: [StayService],
  exports: [StayService],
})
export class StayModule {}
