import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import * as moment from "moment-timezone";

import { AuthModule } from "../auth";
import { DIMIEssentialModules, DIMILoggerMiddleware } from "../common";
import { StaticModules } from "../routes";

import { AppService } from "./app.service";

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
