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
  Response,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import moment from "moment";
import { Types } from "mongoose";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { ObjectIdPipe } from "src/lib/pipes";
import { UniqueTypeValidator } from "src/lib/pipes/unique-validator.pipe";
import { createOpertation } from "src/lib/utils";

import { StatusType, StatusValues } from "src/lib";

import { FrigoDocument, FrigoApplicationDocument } from "src/schemas";

import { ApplyStudentFrigoRequestDto, CreateFrigoRequestDto } from "../dto";
import { FrigoManageService } from "../providers";

@ApiTags("Frigo Manage")
@Controller("manage/frigo")
export class FrigoManageController {
  constructor(private readonly frigoManageService: FrigoManageService) {}

  @ApiOperation(
    createOpertation({
      name: "금요귀가 정보",
      description:
        "금요귀가 정보를 반환합니다. latest가 true면 활성화되어있는 금요귀가만, application이 true이면 학생 신청 정보와 함께 반환합니다.",
    }),
  )
  @ApiQuery({
    required: true,
    name: "latest",
    description: "활성화된 금요귀가만 가져올 것인지 아닌지 여부",
    type: Boolean,
  })
  @ApiQuery({
    required: true,
    name: "application",
    description: "학생 신청 정보도 같이 반환할지 아닌지 여부",
    type: Boolean,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  async getFrigos(
    @Query("latest") getLatestFrigo: boolean,
    @Query("application") getStudentApplication: boolean,
  ): Promise<
    {
      frigo: FrigoDocument;
      applications: FrigoApplicationDocument[] | null;
    }[]
  > {
    const allFrigos = getLatestFrigo
      ? [await this.frigoManageService.getCurrentFrigo()]
      : await this.frigoManageService.getAllFrigos();

    return await Promise.all(
      allFrigos.map(async (frigo) => {
        const applications = getStudentApplication
          ? await this.frigoManageService.getStudentFrigoApplications(frigo._id)
          : null;

        return {
          frigo,
          applications,
        };
      }),
    );
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 생성",
      description: "금요귀가를 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async createFrigo(
    @Body() data: CreateFrigoRequestDto,
  ): Promise<FrigoDocument> {
    return await this.frigoManageService.createFrigo(data);
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 활성화",
      description: "특정 금요귀가를 활성화 합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Patch("/:frigoId/status")
  async enableFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
  ): Promise<FrigoDocument> {
    return await this.frigoManageService.enableFrigo(frigoId);
  }

  @ApiOperation(
    createOpertation({
      name: "금요귀가 비활성화",
      description: "특정 금요귀가를 비활성화 합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/:frigoId/status")
  async disableFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
  ): Promise<FrigoDocument> {
    return await this.frigoManageService.disableFrigo(frigoId);
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
  async getFrigoInformation(
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
      name: "금요귀가 신청 현황 다운로드",
      description: "해당 금요귀가의 신청자 목록을 xlsx로 다운로드합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "frigoId",
    description: "금요귀가의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/:frigoId/excel")
  async downloadFrigoExcel(
    @Response() res,
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
  ): Promise<void> {
    const frigo = await this.frigoManageService.getFrigo(frigoId);
    const wb = await this.frigoManageService.downloadStudentFrigoApplications(
      frigo._id,
    );

    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        encodeURI(
          `${moment().year()}년도 ${moment().week()}주차 금요귀가 명단.xlsx`,
        ),
    );

    await wb.xlsx.write(res);
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
    @Body() data: CreateFrigoRequestDto,
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
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post("/:frigoId/:studentId")
  async applyStudentFrigo(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() body: ApplyStudentFrigoRequestDto,
  ) {
    return this.frigoManageService.applyStudentFrigo(frigoId, studentId, body);
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
    name: "status",
    description: "수리여부",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Patch("/:frigoId/:studentId")
  async setStudentFrigoApprove(
    @Param("frigoId", ObjectIdPipe) frigoId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Query("approve", new UniqueTypeValidator(StatusValues))
    status: StatusType,
  ) {
    return this.frigoManageService.setStudentFrigoStatus(
      frigoId,
      studentId,
      status,
    );
  }
}
