import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import {
  CreateStayDto,
  ManageStayDto,
  ApplyStayDto,
  RejectStayDto,
  ApplyStayOutgoDto,
  ManageStayOutgoDto,
  ApplyStayForceDto,
} from "../dto/stay.dto";
import { ResponseDto } from "src/common/dto";
import {
  EditPermissionGuard,
  ViewPermissionGuard,
  StudentOnlyGuard,
  DIMIJwtAuthGuard,
} from "src/auth/guards";
import { Stay, StayApplication, StayOutgo, StudentDocument } from "src/schemas";
import { StayService } from "../providers/stay.service";

@Controller("stay")
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get()
  async getAllStay(): Promise<Stay[]> {
    return await this.stayService.getAllStay();
  }

  @UseGuards(DIMIJwtAuthGuard)
  @Get("/current")
  async getCurrentStayInfo(): Promise<any> {
    const stay = await this.stayService.getCurrentStay();
    const application = await this.stayService.getStayInfo(stay._id);
    return { stay: stay, application: application };
  }

  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/:id")
  async getStayInfo(@Param("id") stayId: string): Promise<any> {
    return await this.stayService.getStayInfo(stayId);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post()
  async createStay(@Body() data: CreateStayDto): Promise<Stay> {
    return await this.stayService.createStay(data);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("manage")
  async manageStay(@Body() data: ManageStayDto): Promise<Stay> {
    return await this.stayService.manageStay(data);
  }

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Post("apply")
  async applyStay(
    @Body() data: ApplyStayDto,
    @Req() req: Request,
  ): Promise<StayApplication> {
    return await this.stayService.applyStay(data, req.user as StudentDocument);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("apply/force")
  async applyStayForce(
    @Body() data: ApplyStayForceDto,
  ): Promise<StayApplication> {
    return await this.stayService.applyStayForce(data);
  }

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Delete()
  async cancelStay(@Req() req: Request): Promise<ResponseDto> {
    return await this.stayService.cancelStay(req.user._id, false);
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("reject")
  async rejectStay(@Body() data: RejectStayDto): Promise<ResponseDto> {
    return await this.stayService.cancelStay(data.user, true);
  }

  // Stay Outgo
  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Post("outgo/apply")
  async applyStayOutgo(
    @Req() req: Request,
    @Body() data: ApplyStayOutgoDto,
  ): Promise<StayOutgo | ResponseDto> {
    return await this.stayService.applyStayOutgo(data, req.user._id);
  }

  @UseGuards(DIMIJwtAuthGuard, StudentOnlyGuard)
  @Delete("outgo/:id")
  async cancelStayOutgo(
    @Req() req: Request,
    @Param("id") outgoId: string,
  ): Promise<ResponseDto> {
    return await this.stayService.cancelStayOutgo(
      outgoId,
      req.user as StudentDocument,
    );
  }

  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("outgo/manage")
  async manageStayOutgo(@Body() data: ManageStayOutgoDto): Promise<StayOutgo> {
    return await this.stayService.manageStayOutgo(data);
  }
}
