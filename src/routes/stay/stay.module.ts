import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Stay,
  StaySchema,
  StayApplication,
  StayApplicationSchema,
  StayOutgo,
  StayOutgoSchema,
} from "src/schemas";
import { UserModule } from "../user";
import providers from "./providers";
import controllers from "./controllers";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Stay.name, schema: StaySchema },
      { name: StayApplication.name, schema: StayApplicationSchema },
      { name: StayOutgo.name, schema: StayOutgoSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: controllers,
  providers: providers,
  exports: providers,
})
export class StayModule {}
