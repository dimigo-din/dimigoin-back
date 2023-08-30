import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FrigoDocument, StudentDocument } from "src/schemas";
import { FrigoService } from "../providers/frigo.service";
import { ManageFrigoDto, RequestFrigoDto } from "../dto/frigo.dto";
import { ResponseDto } from "src/common/dto";
import { Request } from "express";
import {
  DIMIJwtAuthGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from "src/auth/guards";

@Controller("frigo")
export class FrigoController {
  constructor(private readonly frigoService: FrigoService) {}

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get()
  async getAllFrigoRequests(): Promise<FrigoDocument[]> {
    return await this.frigoService.getAllFrigo();
  }

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
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

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Delete()
  async cancelFrigo(@Req() req: Request): Promise<ResponseDto> {
    return await this.frigoService.cancelFrigo(req.user as StudentDocument);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("manage")
  async manageFrigo(@Body() data: ManageFrigoDto): Promise<FrigoDocument> {
    return await this.frigoService.manageFrigo(data);
  }
}
