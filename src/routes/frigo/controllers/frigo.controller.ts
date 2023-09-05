import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";

import {
  DIMIJwtAuthGuard,
  StudentGuard,
  PermissionGuard,
} from "src/auth/guards";
import { ResponseDto } from "src/common/dto";

import { FrigoDocument, StudentDocument } from "src/schemas";

import { ManageFrigoDto, RequestFrigoDto } from "../dto";
import { FrigoService } from "../providers";

@Controller("frigo")
export class FrigoController {
  constructor(private readonly frigoService: FrigoService) {}

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  async getAllFrigoRequests(): Promise<FrigoDocument[]> {
    return await this.frigoService.getAllFrigo();
  }

  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Post()
  async requestFrigo(
    @Body() data: RequestFrigoDto,
    @Req() req: Request,
  ): Promise<FrigoDocument> {
    return await this.frigoService.requestFrigo(
      data,
      req.user as StudentDocument,
    );
  }

  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Delete()
  async cancelFrigo(@Req() req: Request): Promise<ResponseDto> {
    return await this.frigoService.cancelFrigo(req.user as StudentDocument);
  }

  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post("manage")
  async manageFrigo(@Body() data: ManageFrigoDto): Promise<FrigoDocument> {
    return await this.frigoService.manageFrigo(data);
  }
}
