import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppService } from "./app.service";

import { DIMIEssentialModules, DIMILoggerMiddleware } from "../common";

import { StaticModules } from "../routes";
import { AuthModule } from "../auth";

import * as moment from "moment-timezone";

@Module({
  imports: [AuthModule, ...DIMIEssentialModules, ...StaticModules],
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
