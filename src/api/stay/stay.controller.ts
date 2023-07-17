import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
import { Stay, StayApplication, StayOutgo } from 'src/common/schemas';
import { StayService } from './stay.service';

@Controller('stay')
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @UseGuards(ViewPermissionGuard)
  @Get()
  async getAllStay(): Promise<Stay[]> {
    return this.stayService.getAllStay();
  }

  @UseGuards(EditPermissionGuard)
  @Post()
  async createStay(@Body() data: CreateStayDto): Promise<Stay> {
    return this.stayService.createStay(data);
  }

  @UseGuards(EditPermissionGuard)
  @Post('manage')
  async manageStay(@Body() data: ManageStayDto): Promise<Stay> {
    return this.stayService.manageStay(data);
  }

  @UseGuards(StudentOnlyGuard)
  @Post('apply')
  async applyStay(
    @Body() data: ApplyStayDto,
    @Req() req: Request,
  ): Promise<StayApplication> {
    return this.stayService.applyStay(data, req.user._id);
  }

  @UseGuards(StudentOnlyGuard)
  @Post('cancel')
  async cancelStay(@Req() req: Request): Promise<ResponseDto> {
    return this.stayService.cancelStay(req.user._id);
  }

  @UseGuards(EditPermissionGuard)
  @Post('reject')
  async rejectStay(@Body() data: RejectStayDto): Promise<ResponseDto> {
    return this.stayService.cancelStay(data.user);
  }

  @UseGuards(StudentOnlyGuard)
  @Post('outgo/apply')
  async applyStayOutgo(
    @Req() req: Request,
    @Body() data: ApplyStayOutgoDto,
  ): Promise<StayOutgo | ResponseDto> {
    return this.stayService.applyStayOutgo(data, req.user._id);
  }

  @UseGuards(EditPermissionGuard)
  @Post('outgo/manage')
  async manageStayOutgo(@Body() data: ManageStayOutgoDto): Promise<StayOutgo> {
    return this.stayService.manageStayOutgo(data);
  }
}
