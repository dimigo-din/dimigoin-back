import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { ResponseDto } from "src/common/dto";

import { AfterschoolDocument } from "src/schemas";

import { ManageAfterschoolDto } from "../dto";
import { AfterschoolManageService } from "../providers";

@Controller("manage/afterschool")
export class AfterschoolManageController {
  constructor(
    private readonly afterschoolManageService: AfterschoolManageService,
  ) {}

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadEvent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.afterschoolManageService.uploadAfterschool(file);
  }

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get(":id")
  async getAfterschoolById(
    @Param("id") id: string,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolManageService.getAfterschoolById(id);
  }

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async createAfterschoolById(
    @Body() data: ManageAfterschoolDto,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolManageService.createAfterschoolById(data);
  }

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Patch(":id")
  async manageAfterschoolById(
    @Param("id") id: string,
    @Body() data: ManageAfterschoolDto,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolManageService.manageAfterschoolById(id, data);
  }

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete(":id")
  async deleteAfterschoolById(
    @Param("id") id: string,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolManageService.deleteAfterschoolById(id);
  }
}
