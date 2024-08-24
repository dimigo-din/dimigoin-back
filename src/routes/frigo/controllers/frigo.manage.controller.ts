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
  Query,
  ParseBoolPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
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
      name: "현재 금요귀가 설정",
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

  @ApiOperation(
    createOpertation({
      name: "금요귀가 신청 등록",
      description: "학생의 금요귀가 신청을 등록합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "studentId",
    description: "금요귀가 신청할 학생의 Id",
    type: String,
  })
  @ApiQuery({
    required: true,
    name: "reason",
    description: "금요귀가 사유",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Put("/:frigoId/:studentId")
  async applyStudentFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Query("reason") reason: string,
  ) {
    return this.frigoManageService.applyStudentFrigo(
      frigoId,
      studentId,
      reason,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 신청 삭제",
      description: "학생의 금요귀가 신청을 삭제합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "studentId",
    description: "금요귀가 신청할 학생의 Id",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/:frigoId/:studentId")
  async deleteStudentFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
  ) {
    return this.frigoManageService.cancelStudentFrigo(frigoId, studentId);
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 신청 수리 여부 설정",
      description: "학생의 금요귀가 신청을 수리하거나 반려합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "studentId",
    description: "금요귀가 신청할 학생의 Id",
    type: String,
  })
  @ApiQuery({
    required: true,
    name: "approve",
    description: "수리여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Patch("/:frigoId/:studentId")
  async setStudentFrigoApprove(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Query("studentId", ParseBoolPipe) approve: boolean,
  ) {
    return this.frigoManageService.setStudentFrigoApprove(
      frigoId,
      studentId,
      approve,
    );
  }
}
