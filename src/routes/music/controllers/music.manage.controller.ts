import {
  Request,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { createOpertation } from "src/lib/utils";

import { DIMIJwtAuthGuard, PermissionGuard } from "../../../auth";
import { DeleteDTO, SelectDTO, TeacherMusicListDTO } from "../dto";
import { MusicManageService } from "../providers/music.manage.service";

@ApiTags("Music Manage")
@Controller("/manage/music")
export class MusicManageController {
  constructor(private readonly musicManageService: MusicManageService) {}

  @ApiOperation(
    createOpertation({
      name: "기상곡 목록",
      description: "기상곡 목록을 불러옵니다.",
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    description: "기상곡 목록",
    type: [TeacherMusicListDTO],
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  list() {
    return this.musicManageService.musicList();
  }

  @ApiOperation(
    createOpertation({
      name: "기상곡 확정",
      description: "당일 나올 기상송을 확정짓습니다.",
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  select(@Request() req, @Body() data: SelectDTO) {
    return this.musicManageService.select(req.user._id, data.videoId);
  }

  @ApiOperation(
    createOpertation({
      name: "기상곡 삭제",
      description: "신청된 기상송을 삭제합니다.",
    }),
  )
  @ApiResponse({
    status: HttpStatus.OK,
    description: "성공 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete()
  delete(@Body() data: DeleteDTO) {
    return this.musicManageService.delete(data.videoId);
  }
}
