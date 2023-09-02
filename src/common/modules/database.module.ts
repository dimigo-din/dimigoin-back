import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule, MongooseModuleAsyncOptions } from "@nestjs/mongoose";

import { DIMIConfigModule } from "../modules";

export const Mongooseoptions: MongooseModuleAsyncOptions = {
  imports: [DIMIConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>("MONGO_URI"),
    dbName: "dimigoin",

    connectionFactory: (connection) => {
      return connection;
    },
  }),
  inject: [ConfigService],
};

@Module({ imports: [MongooseModule.forRootAsync(Mongooseoptions)] })
export class DIMIDatabaseModule {}
