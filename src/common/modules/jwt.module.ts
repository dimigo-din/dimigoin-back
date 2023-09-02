import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import "dotenv/config";

export const JWTOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY,
  global: true,
};

@Module({ imports: [JwtModule.register(JWTOptions)] })
export class DIMIJWTModule {}
