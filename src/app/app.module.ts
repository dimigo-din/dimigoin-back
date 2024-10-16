import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import importToArray from "import-to-array";
import * as moment from "moment-timezone";

import { AuthModule } from "src/auth";

import { DIMIEssentialModules, DIMILoggerMiddleware } from "src/lib";

import * as routes from "src/routes";

import { AppService } from "./app.service";

@Module({
  imports: [AuthModule, ...DIMIEssentialModules, ...importToArray(routes)],
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
