import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { GroupModule } from './api/group/group.module';
import { LaundryModule } from './api/laundry/laundry.module';
import { FrigoModule } from './api/frigo/frigo.module';
import { StayModule } from './api/stay/stay.module';
import { JwtModule } from '@nestjs/jwt';
import {
  DIMIJwtExpireMiddleware,
  DIMILoggerMiddleware,
} from './common/middlewares';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { StackModule } from './api/event/event.module';

ConfigModule.forRoot();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    GroupModule,
    LaundryModule,
    FrigoModule,
    StackModule,
    StayModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DIMILoggerMiddleware).forRoutes('*');
    consumer
      .apply(DIMIJwtExpireMiddleware)
      .exclude('/auth/login', '/auth/refresh', '/auth/logout', '/event/upload')
      .forRoutes('*');
  }
}
