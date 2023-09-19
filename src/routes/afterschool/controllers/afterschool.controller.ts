import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";
import { Types } from "mongoose";

import { DIMIJwtAuthGuard, StudentGuard } from "src/auth/guards";
import { ResponseDto } from "src/common/dto";
import { createOpertation } from "src/common/utils";

import {
  AfterschoolApplication,
  AfterschoolApplicationDocument,
  AfterschoolDocument,
  StudentDocument,
} from "src/schemas";

import { AfterschoolService } from "../providers";

@ApiTags("Afterschool")
@Controller("afterschool")
export class AfterschoolController {
  constructor(private readonly afterschoolService: AfterschoolService) {}

  @ApiOperation(
    createOpertation({
      name: "방과후 리스트",
      description: "신청가능한 방과후 리스트를 가져옵니다.",
      studentOnly: true,
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get()
  async getAfterschools(@Req() req: Request): Promise<AfterschoolDocument[]> {
    return await this.afterschoolService.getAfterschools(
      req.user as StudentDocument,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "방과후 신청 리스트",
      description: "학생이 신청한 방과후 리스트를 가져옵니다.",
      studentOnly: true,
    }),
  )
  @ApiResponse({
    status: 200,
    type: [AfterschoolApplication],
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Get("/application")
  async getAfterschoolApplications(
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument[]> {
    return await this.afterschoolService.getAfterschoolApplications(
      req.user as StudentDocument,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "방과후 신청",
      description: "학생이 방과후를 신청합니다.",
      studentOnly: true,
    }),
  )
  @ApiParam({
    required: true,
    name: "afterschoolId",
    description: "방과후의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Post("/:afterschoolId")
  async applyAfterschool(
    @Param("afterschoolId") afterschoolId: Types.ObjectId,
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument> {
    return await this.afterschoolService.applyAfterschool(
      req.user as StudentDocument,
      afterschoolId,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "방과후 신청 취소",
      description: "학생이 방과후 신청을 취소합니다.",
      studentOnly: true,
    }),
  )
  @ApiParam({
    required: true,
    name: "afterschoolId",
    description: "방과후의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, StudentGuard)
  @Delete("/:afterschoolId")
  async cancelAfterschool(
    @Param("afterschoolId") afterschoolId: Types.ObjectId,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    return await this.afterschoolService.cancelAfterschool(
      req.user as StudentDocument,
      afterschoolId,
    );
  }
}
