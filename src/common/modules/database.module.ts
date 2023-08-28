import { MongooseModule, MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";

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
