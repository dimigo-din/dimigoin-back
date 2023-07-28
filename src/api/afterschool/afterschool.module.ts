import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Afterschool,
  AfterschoolSchema,
  AfterschoolApplication,
  AfterschoolApplicationSchema,
} from 'src/common/schemas';
import { UserModule } from '../user/user.module';
import { AfterschoolController } from './afterschool.controller';
import { AfterschoolService } from './afterschool.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Afterschool.name, schema: AfterschoolSchema },
      {
        name: AfterschoolApplication.name,
        schema: AfterschoolApplicationSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [AfterschoolController],
  providers: [AfterschoolService],
  exports: [AfterschoolService],
})
export class AfterschoolModule {}
