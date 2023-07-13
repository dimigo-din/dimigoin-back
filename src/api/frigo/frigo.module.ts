import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Frigo, FrigoSchema } from 'src/common/schemas';
import { FrigoController } from './frigo.controller';
import { FrigoService } from './frigo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Frigo.name, schema: FrigoSchema }]),
  ],
  controllers: [FrigoController],
  providers: [FrigoService],
  exports: [FrigoService],
})
export class FrigoModule {}
