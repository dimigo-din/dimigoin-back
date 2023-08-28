import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Place, PlaceGroup, PlaceGroupSchema, PlaceSchema } from "src/schemas";
import { PlaceController } from "./controllers/place.controller";
import { PlaceService } from "./providers/place.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    MongooseModule.forFeature([
      { name: PlaceGroup.name, schema: PlaceGroupSchema },
    ]),
  ],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}
