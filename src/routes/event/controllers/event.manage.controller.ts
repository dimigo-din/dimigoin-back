import {
  Controller,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { createOpertation } from "src/common/utils";

import { Event } from "src/schemas";

import { EventManageService } from "../providers";

@ApiTags("Event Manage")
@Controller("manage/event")
export class EventManageController {
  constructor(private readonly eventManageService: EventManageService) {}

  @ApiOperation(
    createOpertation({
      name: "이벤트 수정",
      description: "이벤트를 수정합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Put()
  async uploadEvent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Event[]> {
    if (!file) throw new HttpException("파일이 없습니다.", 400);

    return await this.eventManageService.uploadEvent(file);
  }
}
