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
import {
  CreateStayDto,
  ManageStayDto,
  ApplyStayDto,
  ResponseDto,
  RejectStayDto,
  ApplyStayOutgoDto,
  ManageStayOutgoDto,
} from 'src/common/dto';
import {
  EditPermissionGuard,
  ViewPermissionGuard,
  StudentOnlyGuard,
} from 'src/common/guard';
import { Stay, StayApplication, StayOutgo, StudentDocument } from 'src/common/schemas';
import { StayService } from './stay.service';

@Controller('stay')
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @UseGuards(ViewPermissionGuard)
  @Get()
  async getAllStay(): Promise<Stay[]> {
    return await this.stayService.getAllStay();
  }

  @Get('/:id')
  async getStayInfo(@Param('id') stayId: string): Promise<any> {
    return await this.stayService.getStayInfo(stayId);
  }

  @UseGuards(EditPermissionGuard)
  @Post()
  async createStay(@Body() data: CreateStayDto): Promise<Stay> {
    return await this.stayService.createStay(data);
  }

  @UseGuards(EditPermissionGuard)
  @Post('manage')
  async manageStay(@Body() data: ManageStayDto): Promise<Stay> {
    return await this.stayService.manageStay(data);
  }

  @UseGuards(StudentOnlyGuard)
  @Post('apply')
  async applyStay(
    @Body() data: ApplyStayDto,
    @Req() req: Request,
  ): Promise<StayApplication> {
    return await this.stayService.applyStay(data, req.user as StudentDocument);
  }

  @UseGuards(StudentOnlyGuard)
  @Delete()
  async cancelStay(@Req() req: Request): Promise<ResponseDto> {
    return await this.stayService.cancelStay(req.user._id, false);
  }

  @UseGuards(EditPermissionGuard)
  @Delete('reject')
  async rejectStay(@Body() data: RejectStayDto): Promise<ResponseDto> {
    return await this.stayService.cancelStay(data.user, true);
  }

  // Stay Outgo
  @UseGuards(StudentOnlyGuard)
  @Post('outgo/apply')
  async applyStayOutgo(
    @Req() req: Request,
    @Body() data: ApplyStayOutgoDto,
  ): Promise<StayOutgo | ResponseDto> {
    return await this.stayService.applyStayOutgo(data, req.user._id);
  }

  @UseGuards(EditPermissionGuard)
  @Post('outgo/manage')
  async manageStayOutgo(@Body() data: ManageStayOutgoDto): Promise<StayOutgo> {
    return await this.stayService.manageStayOutgo(data);
  }
}
