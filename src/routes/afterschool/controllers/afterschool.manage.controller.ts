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
  Req,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { ResponseDto } from "src/common/dto";

import {
  AfterschoolApplicationDocument,
  AfterschoolApplicationResponse,
  AfterschoolDocument,
  StudentDocument,
} from "src/schemas";

import { ManageAfterschoolDto } from "../dto";
import { AfterschoolManageService } from "../providers";

@Controller("manage/afterschool")
export class AfterschoolManageController {
  constructor(
    private readonly afterschoolManageService: AfterschoolManageService,
  ) {}

  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getAllAfterschool(): Promise<AfterschoolDocument[]> {
    return await this.afterschoolManageService.getAllAfterschool();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/user")
  async getAfterschoolByUser(
    @Req() req: Request,
  ): Promise<AfterschoolDocument[]> {
    return await this.afterschoolManageService.getAfterschoolByUser(
      req.user as StudentDocument,
    );
  }

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadEvent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.afterschoolManageService.uploadAfterschool(file);
  }

  @UseGuards(DIMIJwtAuthGuard, DIMIJwtAuthGuard)
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

  @UseGuards(DIMIJwtAuthGuard)
  @Get("application")
  async getAllApplication(): Promise<AfterschoolApplicationDocument[]> {
    return await this.afterschoolManageService.getAllApplication();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("application/my")
  async getMyApplication(
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument[]> {
    return await this.afterschoolManageService.getMyApplication(
      req.user as StudentDocument,
    );
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("application/:id")
  async getApplicationById(
    @Param("id") id: string,
  ): Promise<AfterschoolApplicationResponse> {
    return await this.afterschoolManageService.getApplicationById(id);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Post("application/:id")
  async createApplication(
    @Param("id") id: string,
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument> {
    return await this.afterschoolManageService.createApplication(
      id,
      req.user as StudentDocument,
    );
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Delete("application/:id")
  async cancelApplication(
    @Param("id") id: string,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    return await this.afterschoolManageService.cancelApplication(
      id,
      req.user as StudentDocument,
    );
  }
}
