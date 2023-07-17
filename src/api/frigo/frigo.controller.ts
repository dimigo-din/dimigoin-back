import { Body, Controller, Get, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { FrigoDocument, StudentDocument } from 'src/common/schemas';
import { FrigoService } from './frigo.service';
import { ManageFrigoDto, RequestFrigoDto } from 'src/common/dto';
import { Request } from 'express';
import {
  EditPermissionGuard,
  StudentOnlyGuard,
  ViewPermissionGuard,
} from 'src/common/guard';

@Controller('frigo')
export class FrigoController {
  constructor(private readonly frigoService: FrigoService) {}

  @UseGuards(ViewPermissionGuard)
  @Get()
  async getAllFrigoRequests(): Promise<FrigoDocument[]> {
    return this.frigoService.getAllFrigo();
  }

  @UseGuards(StudentOnlyGuard)
  @Post()
  async requestFrigo(
    @Body() data: RequestFrigoDto,
    @Req() req: Request,
  ): Promise<FrigoDocument> {
    return this.frigoService.requestFrigo(data, req.user as StudentDocument);
  }

  @UseGuards(EditPermissionGuard)
  @Post('manage')
  async manageFrigo(@Body() data: ManageFrigoDto): Promise<FrigoDocument> {
    return this.frigoService.manageFrigo(data);
  }
}
