import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Frigo, FrigoSchema } from "src/schemas";
import { FrigoController } from "./controllers/frigo.controller";
import { FrigoService } from "./providers/frigo.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Frigo.name, schema: FrigoSchema }]),
  ],
  controllers: [FrigoController],
  providers: [FrigoService],
  exports: [FrigoService],
})
export class FrigoModule {}
