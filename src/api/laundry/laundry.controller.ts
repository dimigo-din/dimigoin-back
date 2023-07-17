import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApplyLaundryDto,
  CreateWasherDto,
  EditWasherDto,
  ResponseDto,
} from 'src/common/dto';
import { ViewPermissionGuard } from 'src/common/guard';
import { StudentDocument, Washer } from 'src/common/schemas';
import { LaundryService } from './laundry.service';

@Controller('laundry')
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @UseGuards(ViewPermissionGuard)
  @Get('washer')
  async getAllWashers(): Promise<Washer[]> {
    return this.laundryService.getAllWashers();
  }

  @Post('washer/create')
  async createWasher(@Body() data: CreateWasherDto): Promise<Washer> {
    return this.laundryService.createWasher(data);
  }

  @Patch('washer/edit')
  async editWasher(@Body() data: EditWasherDto): Promise<Washer> {
    return this.laundryService.editWasher(data);
  }

  @Post('apply')
  async applyLaundry(
    @Body() data: ApplyLaundryDto,
    @Req() req: Request,
  ): Promise<Washer> {
    return this.laundryService.applyLaundry(data, req.user as StudentDocument);
  }

  @Get('available')
  async getAvailable(@Req() req: Request): Promise<Washer[]> {
    return this.laundryService.getAvailable(req.user as StudentDocument);
  }

  @Get('washer/reset')
  async resetWasher(): Promise<ResponseDto> {
    await this.laundryService.resetLaundry();
    return { status: 200, message: 'success' };
  }
}
