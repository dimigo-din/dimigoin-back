import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stay, StaySchema } from 'src/common/schemas';
import { StayService } from './stay.service';
import { StayController } from './stay.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stay.name, schema: StaySchema }]),
  ],
  controllers: [StayController],
  providers: [StayService],
  exports: [StayService],
})
export class StayModule {}
