import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Place, PlaceSchema, Location, LocationSchema } from "src/schemas";
import { StayModule } from "../stay/stay.module";
import { LocationController } from "./controllers/location.controller";
import { LocationService } from "./providers/location.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    StayModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
