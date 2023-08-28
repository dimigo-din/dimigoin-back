import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import {
  ApplyLaundryDto,
  CreateWasherDto,
  EditWasherDto,
} from "../dto/laundry.dto";
import { ResponseDto } from "src/common/dto";
import {
  ViewPermissionGuard,
  EditPermissionGuard,
  StudentOnlyGuard,
} from "src/auth/guards";
import { StudentDocument, WasherDocument } from "src/schemas";
import { LaundryService } from "../providers/laundry.service";

@Controller("laundry")
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @UseGuards(ViewPermissionGuard)
  @Get("washer")
  async getAllWashers(): Promise<WasherDocument[]> {
    return await this.laundryService.getAllWashers();
  }

  @UseGuards(EditPermissionGuard)
  @Post("washer/create")
  async createWasher(@Body() data: CreateWasherDto): Promise<WasherDocument> {
    return await this.laundryService.createWasher(data);
  }

  @UseGuards(EditPermissionGuard)
  @Patch("washer/edit")
  async editWasher(@Body() data: EditWasherDto): Promise<WasherDocument> {
    return await this.laundryService.editWasher(data);
  }

  @UseGuards(StudentOnlyGuard)
  @Post("apply")
  async applyLaundry(
    @Body() data: ApplyLaundryDto,
    @Req() req: Request,
  ): Promise<WasherDocument> {
    return await this.laundryService.applyLaundry(
      data,
      req.user as StudentDocument,
    );
  }

  @UseGuards(StudentOnlyGuard)
  @Delete()
  async cancelLaundry(@Req() req: Request): Promise<WasherDocument> {
    return await this.laundryService.cancelLaundry(req.user as StudentDocument);
  }

  @UseGuards(StudentOnlyGuard)
  @Get("available")
  async getAvailable(@Req() req: Request): Promise<WasherDocument[]> {
    return await this.laundryService.getAvailable(req.user as StudentDocument);
  }

  @UseGuards(EditPermissionGuard)
  @Get("washer/reset")
  async resetWasher(): Promise<ResponseDto> {
    await this.laundryService.resetLaundry();
    return { statusCode: 200, message: "success" };
  }
}
