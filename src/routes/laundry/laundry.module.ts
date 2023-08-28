import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Washer, WasherSchema } from "src/schemas";
import { LaundryService } from "./providers/laundry.service";
import { LaundryController } from "./controllers/laundry.controller";
import { StayModule } from "../stay/stay.module";

@Module({
  imports: [
    StayModule,
    MongooseModule.forFeature([{ name: Washer.name, schema: WasherSchema }]),
  ],
  controllers: [LaundryController],
  providers: [LaundryService],
  exports: [LaundryService],
})
export class LaundryModule {}
