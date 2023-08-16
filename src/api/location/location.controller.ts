import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ResponseDto } from 'src/common/dto';
import { Location, StudentDocument } from 'src/common/schemas';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async getAllLocation(): Promise<Location[]> {
    return await this.locationService.getAllLocation();
  }

  @Get('/:grade/:class')
  async getLocationByGC(
    @Param('grade') _grade: number,
    @Param('class') _class: number,
  ): Promise<Location[]> {
    return await this.locationService.getLocationByGC(_grade, _class);
  }

  @Get('/:id')
  async changeLocation(
    @Req() req: Request,
    @Param('id') placeId: string,
  ): Promise<Location> {
    return await this.locationService.changeLocation(req.user as StudentDocument, placeId);
  }

  @Delete()
  async resetLocation(
    @Req() req: Request,
  ): Promise<ResponseDto> {
    return await this.locationService.resetLocation(req.user as StudentDocument);
  }
}
