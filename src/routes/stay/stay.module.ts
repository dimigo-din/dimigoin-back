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
import { StayService } from "./providers/stay.service";
import { StayController } from "./controllers/stay.controller";
import { UserModule } from "../user";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Stay.name, schema: StaySchema },
      { name: StayApplication.name, schema: StayApplicationSchema },
      { name: StayOutgo.name, schema: StayOutgoSchema },
    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [StayController],
  providers: [StayService],
  exports: [StayService],
})
export class StayModule {}
