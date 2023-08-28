import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Group, GroupSchema } from "src/schemas";
import { GroupController } from "./controllers/group.controller";
import { GroupService } from "./providers/group.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
