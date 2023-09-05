import { Controller, Delete, Get, Param, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";

import { DIMIJwtAuthGuard } from "src/auth/guards";
import { ResponseDto } from "src/common/dto";
import { GradeValues, ClassValues } from "src/common/types";

import { Location, LocationDocument, StudentDocument } from "src/schemas";

import { LocationService } from "../providers";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(DIMIJwtAuthGuard)
  @Get()
  async getAllLocation(): Promise<Location[]> {
    return await this.locationService.getAllLocation();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/:grade/:class")
  async getLocationByGC(
    @Param("grade") _grade: (typeof GradeValues)[number],
    @Param("class") _class: (typeof ClassValues)[number],
  ): Promise<LocationDocument[]> {
    return await this.locationService.getLocationByGC(_grade, _class);
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/:id")
  async changeLocation(
    @Req() req: Request,
    @Param("id") placeId: string,
  ): Promise<LocationDocument> {
    return await this.locationService.changeLocation(
      req.user as StudentDocument,
      placeId,
    );
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Delete()
  async resetLocation(@Req() req: Request): Promise<ResponseDto> {
    return await this.locationService.resetLocation(
      req.user as StudentDocument,
    );
  }
}
