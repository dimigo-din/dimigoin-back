import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { DIMIJwtAuthGuard } from "src/auth/guards";

import { PlaceDocument, PlaceGroupDocument } from "src/schemas";

import { CreatePlaceDto, CreatePlaceGroupDto } from "../dto";
import { PlaceService } from "../providers";

@Controller("place")
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getAllPlace(): Promise<any> {
    return await this.placeService.getAllPlace();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Post()
  async createPlace(@Body() data: CreatePlaceDto): Promise<PlaceDocument> {
    return await this.placeService.createPlace(data);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/group/:id")
  async getPlacesByGroup(
    @Param("id") groupId: string,
  ): Promise<PlaceDocument[]> {
    return await this.placeService.getPlacesByGroup(groupId);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Patch("/group/:id")
  async managePlaceGroup(
    @Param("id") groupId: string,
    @Body() data: CreatePlaceGroupDto,
  ): Promise<PlaceGroupDocument> {
    return await this.placeService.managePlaceGroup(groupId, data);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Post("/group")
  async createPlaceGroup(
    @Body() data: CreatePlaceGroupDto,
  ): Promise<PlaceGroupDocument> {
    return await this.placeService.createPlaceGroup(data);
  }
}
