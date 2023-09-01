import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import {
  CreateStayDto,
  ManageStayDto,
  RejectStayDto,
  ManageStayOutgoDto,
  ApplyStayForceDto,
} from "../dto/stay.dto";
import { ResponseDto } from "src/common/dto";
import {
  EditPermissionGuard,
  ViewPermissionGuard,
  DIMIJwtAuthGuard,
} from "src/auth/guards";
import { Stay, StayApplication, StayOutgo } from "src/schemas";
import { StayManageService } from "../providers";

@ApiTags("Stay Manage")
@Controller("manage/stay")
export class StayManageController {
  constructor(private readonly stayManageService: StayManageService) {}

  @ApiOperation({ summary: "모든 잔류 정보" })
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get()
  async getAllStay(): Promise<Stay[]> {
    return await this.stayManageService.getAll();
  }

  @ApiOperation({ summary: "잔류 생성" })
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post()
  async createStay(@Body() data: CreateStayDto): Promise<Stay> {
    return await this.stayManageService.create(data);
  }

  @ApiOperation({ summary: "잔류 수정" })
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Put()
  async manageStay(@Body() data: ManageStayDto): Promise<Stay> {
    return await this.stayManageService.edit(data);
  }

  @ApiOperation({ summary: "잔류 정보" })
  @UseGuards(DIMIJwtAuthGuard, ViewPermissionGuard)
  @Get("/:id")
  async getStayInfo(@Param("id") stayId: string): Promise<any> {
    return await this.stayManageService.getStayInfo(stayId);
  }

  @ApiOperation({ summary: "잔류 삭제" })
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("/:id")
  async deleteStay(@Body() data: ManageStayDto): Promise<Stay> {
    return await this.stayManageService.edit(data);
  }

  @ApiOperation({ summary: "잔류 학생 추가" })
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("student")
  async applyStayForce(
    @Body() data: ApplyStayForceDto,
  ): Promise<StayApplication> {
    return await this.stayManageService.applyStayForce(data);
  }

  @ApiOperation({ summary: "잔류 학생 삭제" })
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Delete("student")
  async rejectStay(@Body() data: RejectStayDto): Promise<ResponseDto> {
    return await this.stayManageService.cancelStay(data.user, true);
  }

  @ApiOperation({ summary: "잔류외출 학생 추가" })
  @UseGuards(DIMIJwtAuthGuard, EditPermissionGuard)
  @Post("outgo/student")
  async manageStayOutgo(@Body() data: ManageStayOutgoDto): Promise<StayOutgo> {
    return await this.stayManageService.manageStayOutgo(data);
  }
}
