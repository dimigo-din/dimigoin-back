import { Module } from "@nestjs/common";
import { ConfigModule, ConfigModuleOptions } from "@nestjs/config";

export const options: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: process.env.NODE_ENV == "dev" ? ".env.dev" : ".env",
};

@Module({ imports: [ConfigModule.forRoot(options)] })
export class DIMIConfigModule {}
