import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { JwtModule } from "@nestjs/jwt";

import { AppService } from "./app.service";

import {
  DIMIConfigModule,
  DIMIDatabaseModule,
  DIMILoggerMiddleware,
} from "../common";

import { StaticModules } from "../routes";
import { AuthModule } from "../auth";

import * as moment from "moment-timezone";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DIMIConfigModule,
    DIMIDatabaseModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: "30m" },
    }),
    ...StaticModules,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {
    moment.tz.setDefault("Asia/Seoul");
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DIMILoggerMiddleware).forRoutes("*");
  }
}
