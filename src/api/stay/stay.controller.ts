import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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
  ApplyStayForceDto,
} from 'src/common/dto';
import {
  EditPermissionGuard,
  ViewPermissionGuard,
  StudentOnlyGuard,
} from 'src/common/guard';
import { Stay, StayApplication, StayOutgo, StudentDocument } from 'src/common/schemas';
import { UserService } from '../user/user.service';
import { StayService } from './stay.service';

@Controller('stay')
export class StayController {
  constructor(
    private readonly stayService: StayService,
  ) {}

  @UseGuards(ViewPermissionGuard)
  @Get()
  async getAllStay(): Promise<Stay[]> {
    return await this.stayService.getAllStay();
  }

  @Get('/current')
  async getCurrentStayInfo(): Promise<any> {
    const stay = await this.stayService.getCurrentStay();
    const application = await this.stayService.getStayInfo(stay._id);
    return { stay: stay, application: application };
  }

  @UseGuards(ViewPermissionGuard)
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

  @UseGuards(EditPermissionGuard)
  @Post('apply/force')
  async applyStayForce(
    @Body() data: ApplyStayForceDto,
  ): Promise<StayApplication> {
    return await this.stayService.applyStayForce(data);
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

  @UseGuards(StudentOnlyGuard)
  @Delete('outgo/:id')
  async cancelStayOutgo(
    @Req() req: Request,
    @Param('id') outgoId: string
  ): Promise<StayOutgo | ResponseDto> {
    return await this.stayService.cancelStayOutgo(outgoId, req.user as StudentDocument);
  }

  @UseGuards(EditPermissionGuard)
  @Post('outgo/manage')
  async manageStayOutgo(@Body() data: ManageStayOutgoDto): Promise<StayOutgo> {
    return await this.stayService.manageStayOutgo(data);
  }
}
