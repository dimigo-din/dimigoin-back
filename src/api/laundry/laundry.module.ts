import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Washer, WasherSchema } from 'src/common/schemas';
import { LaundryService } from './laundry.service';
import { LaundryController } from './laundry.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Washer.name, schema: WasherSchema }]),
  ],
  controllers: [LaundryController],
  providers: [LaundryService],
  exports: [LaundryService],
})
export class LaundryModule {}
