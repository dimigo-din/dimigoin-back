import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Journal, JournalSchema } from "src/schemas";
import { JournalController } from "./controllers/journal.controller";
import { JournalService } from "./providers/journal.service";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
    PassportModule,
  ],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
