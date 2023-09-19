import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Types } from "mongoose";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { ObjectIdPipe } from "src/common/pipes";
import { createOpertation } from "src/common/utils";

import { FrigoDocument, FrigoApplicationDocument } from "src/schemas";

import { CreateFrigoDto } from "../dto";
import { FrigoManageService } from "../providers";

@ApiTags("Frigo Manage")
@Controller("manage/frigo")
export class FrigoManageController {
  constructor(private readonly frigoManageService: FrigoManageService) {}

  @ApiOperation(
    createOpertation({
      name: "금요귀가 리스트",
      description: "모든 금요귀가를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  async getFrigos(): Promise<FrigoDocument[]> {
    return await this.frigoManageService.getFrigos();
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 생성",
      description: "금요귀가를 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async createFrigo(@Body() data: CreateFrigoDto): Promise<FrigoDocument> {
    return await this.frigoManageService.createFrigo(data);
  }

  @ApiOperation(
    createOpertation({
      name: "현재 금요귀가 정보",
      description:
        "현재 활성화 되어있는 금요귀가 정보와 금요귀가 신청자 목록을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/current")
  async getCurrentFrigo(): Promise<{
    frigo: FrigoDocument;
    applications: FrigoApplicationDocument[];
  }> {
    const frigo = await this.frigoManageService.getCurrentFrigo();
    const applications =
      await this.frigoManageService.getStudentFrigoApplications(frigo._id);

    return {
      frigo,
      applications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "현재 금요위가 설정",
      description: "해당 금요귀가를 활성화 합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Patch("/current/:frigoId")
  async setCurrentFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
  ): Promise<FrigoDocument> {
    return await this.frigoManageService.setCurrentFrigo(frigoId);
  }

  @ApiOperation(
    createOpertation({
      name: "현재 금요귀가 해제",
      description: "해당 금요귀가를 비활성화 합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/current/:frigoId")
  async deleteCurrentFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
  ): Promise<FrigoDocument> {
    return await this.frigoManageService.deleteCurrentFrigo(frigoId);
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 정보",
      description: "해당 금요귀가 정보와 금요귀가 신청자 목록을 반환합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/:frigoId")
  async getFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
  ): Promise<{
    frigo: FrigoDocument;
    applications: FrigoApplicationDocument[];
  }> {
    const frigo = await this.frigoManageService.getFrigo(frigoId);
    const applications =
      await this.frigoManageService.getStudentFrigoApplications(frigo._id);

    return {
      frigo,
      applications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 수정",
      description: "해당 금요귀가를 수정합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Put("/:frigoId")
  async editFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
    @Body() data: CreateFrigoDto,
  ): Promise<FrigoDocument> {
    return await this.frigoManageService.editFrigo(frigoId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 삭제",
      description: "해당 금요귀가를 삭제합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/:frigoId")
  async deleteFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
  ): Promise<FrigoDocument> {
    return await this.frigoManageService.deleteFrigo(frigoId);
  }
}
