import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Journal, JournalSchema } from "src/schemas";
import { JournalController } from "./controllers/journal.controller";
import { JournalService } from "./providers/journal.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
  ],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
