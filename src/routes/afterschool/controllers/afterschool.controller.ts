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

import { DIMIJwtAuthGuard, EditPermissionGuard } from "src/auth/guards";
import { ResponseDto } from "src/common/dto";

import {
  AfterschoolApplicationDocument,
  AfterschoolApplicationResponse,
  AfterschoolDocument,
  StudentDocument,
} from "src/schemas";

import { ManageAfterschoolDto } from "../dto";
import { AfterschoolService } from "../providers";

@Controller("afterschool")
export class AfterschoolController {
  constructor(private readonly afterschoolService: AfterschoolService) {}

  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getAllAfterschool(): Promise<AfterschoolDocument[]> {
    return await this.afterschoolService.getAllAfterschool();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/user")
  async getAfterschoolByUser(
    @Req() req: Request,
  ): Promise<AfterschoolDocument[]> {
    return await this.afterschoolService.getAfterschoolByUser(
      req.user as StudentDocument,
    );
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadEvent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.afterschoolService.uploadAfterschool(file);
  }

  @UseGuards(DIMIJwtAuthGuard, DIMIJwtAuthGuard)
  @Get(":id")
  async getAfterschoolById(
    @Param("id") id: string,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.getAfterschoolById(id);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post()
  async createAfterschoolById(
    @Body() data: ManageAfterschoolDto,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.createAfterschoolById(data);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Patch(":id")
  async manageAfterschoolById(
    @Param("id") id: string,
    @Body() data: ManageAfterschoolDto,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.manageAfterschoolById(id, data);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete(":id")
  async deleteAfterschoolById(
    @Param("id") id: string,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.deleteAfterschoolById(id);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("application")
  async getAllApplication(): Promise<AfterschoolApplicationDocument[]> {
    return await this.afterschoolService.getAllApplication();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("application/my")
  async getMyApplication(
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument[]> {
    return await this.afterschoolService.getMyApplication(
      req.user as StudentDocument,
    );
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("application/:id")
  async getApplicationById(
    @Param("id") id: string,
  ): Promise<AfterschoolApplicationResponse> {
    return await this.afterschoolService.getApplicationById(id);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Post("application/:id")
  async createApplication(
    @Param("id") id: string,
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument> {
    return await this.afterschoolService.createApplication(
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
    return await this.afterschoolService.cancelApplication(
      id,
      req.user as StudentDocument,
    );
  }
}
