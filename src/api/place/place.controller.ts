import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Place, PlaceDocument, PlaceGroup, PlaceGroupDocument } from 'src/common/schemas';
import { PlaceService } from './place.service';
import { CreatePlaceDto, CreatePlaceGroupDto } from 'src/common/dto';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  // Place
  @Get()
  async getAllPlace(): Promise<any> {
    return await this.placeService.getAllPlace();
  }

  @Post()
  async createPlace(@Body() data: CreatePlaceDto): Promise<PlaceDocument> {
    return await this.placeService.createPlace(data);
  }

  // PlaceGroup
  @Get('/group/:id')
  async getPlacesByGroup(@Param('id') groupId: string): Promise<PlaceDocument[]> {
    return await this.placeService.getPlacesByGroup(groupId);
  }

  @Patch('/group/:id')
  async managePlaceGroup(@Param('id') groupId: string, @Body() data: CreatePlaceGroupDto): Promise<PlaceGroupDocument> {
    return await this.placeService.managePlaceGroup(groupId, data);
  }

  @Post('/group')
  async createPlaceGroup(@Body() data: CreatePlaceGroupDto): Promise<PlaceGroupDocument> {
    return await this.placeService.createPlaceGroup(data);
  }
}
