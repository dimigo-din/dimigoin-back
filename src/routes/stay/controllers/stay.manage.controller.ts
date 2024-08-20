import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Patch,
  Param,
  UseGuards,
  Response,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Types } from "mongoose";

import { DIMIJwtAuthGuard, PermissionGuard } from "src/auth/guards";
import { ObjectIdPipe } from "src/common/pipes";
import { createOpertation } from "src/common/utils";

import { Stay, StayApplication, StayOutgoDocument } from "src/schemas";

import { ApplyStayDto, CreateStayDto, ApplyStayOutgoDto } from "../dto";
import { StayManageService } from "../providers";

@ApiTags("Stay Manage")
@Controller("manage/stay")
export class StayManageController {
  constructor(private readonly stayManageService: StayManageService) {}

  @ApiOperation(
    createOpertation({
      name: "잔류 리스트",
      description: "모든 잔류를 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get()
  async getStays(): Promise<Stay[]> {
    return await this.stayManageService.getStays();
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 생성",
      description: "잔류를 생성합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post()
  async createStay(@Body() data: CreateStayDto): Promise<Stay> {
    return await this.stayManageService.createStay(data);
  }

  @ApiOperation(
    createOpertation({
      name: "현재 잔류 정보",
      description:
        "현재 활성화 되어있는 잔류 정보와 잔류 신청자 목록을 반환합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/current")
  async getCurrentStay(): Promise<{
    stay: Stay;
    applications: StayApplication[];
  }> {
    const stay = await this.stayManageService.getCurrentStay();
    const applications = await this.stayManageService.getStayApplications(
      stay._id,
    );

    return {
      stay,
      applications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "현재 잔류 정보 다운로드",
      description:
        "현재 활성화 되어있는 잔류 정보와 잔류 신청자 목록, 그리고 외출 정보를 다운로드합니다.",
    }),
  )
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/current/excel")
  async downloadStayApplicationsExcel(@Response() res): Promise<void> {
    const stay = await this.stayManageService.getCurrentStay();
    await this.stayManageService.downloadStayApplicationsExcel(stay._id, res);
  }

  @ApiOperation(
    createOpertation({
      name: "현재 잔류 설정",
      description: "해당 잔류를 활성화 합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Patch("/current/:stayId")
  async setCurrentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<Stay> {
    return await this.stayManageService.setCurrentStay(stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "현재 잔류 해제",
      description: "해당 잔류를 비활성화 합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/current/:stayId")
  async deleteCurrentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<Stay> {
    return await this.stayManageService.deleteCurrentStay(stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 정보",
      description: "해당 잔류 정보와 잔류 신청자 목록을 반환합니다.",
    }),
  )
  @ApiParam({
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Get("/:stayId")
  async getStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<{
    stay: Stay;
    applications: StayApplication[];
  }> {
    const stay = await this.stayManageService.getStay(stayId);
    const applications = await this.stayManageService.getStayApplications(
      stayId,
    );
    return {
      stay,
      applications,
    };
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 수정",
      description: "해당 잔류 정보를 수정합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Put("/:stayId")
  async editStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Body() data: CreateStayDto,
  ): Promise<Stay> {
    return await this.stayManageService.editStay(stayId, data);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 삭제",
      description: "해당 잔류를 삭제합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/:stayId")
  async deleteStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
  ): Promise<Stay> {
    return await this.stayManageService.deleteStay(stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 학생 추가",
      description: "학생 잔류 신청을 추가합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "studentId",
    description: "학생의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post("/:stayId/:studentId")
  async applyStudentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() data: ApplyStayDto,
  ): Promise<StayApplication> {
    return await this.stayManageService.applyStudentStay(
      studentId,
      stayId,
      data,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "잔류 학생 삭제",
      description: "학생 잔류 신청을 삭제합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "studentId",
    description: "학생의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/:stayId/:studentId")
  async cancelStudentStay(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
  ): Promise<StayApplication> {
    return await this.stayManageService.cancelStudentStay(studentId, stayId);
  }

  @ApiOperation(
    createOpertation({
      name: "잔류외출 학생 추가",
      description: "학생 잔류외출 신청을 추가합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "studentId",
    description: "학생의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Post("/outgo/:stayId/:studentId")
  async applyStudentStayOutgo(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Body() data: ApplyStayOutgoDto,
  ): Promise<StayOutgoDocument> {
    return await this.stayManageService.applyStudentStayOutgo(
      studentId,
      stayId,
      data,
    );
  }

  @ApiOperation(
    createOpertation({
      name: "잔류외출 학생 삭제",
      description: "학생 잔류외출 신청을 삭제합니다.",
    }),
  )
  @ApiParam({
    required: true,
    name: "stayId",
    description: "잔류의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "studentId",
    description: "학생의 ObjectId",
    type: String,
  })
  @ApiParam({
    required: true,
    name: "stayOutgoId",
    description: "잔류외출 신청의 ObjectId",
    type: String,
  })
  @UseGuards(DIMIJwtAuthGuard, PermissionGuard)
  @Delete("/outgo/:stayId/:studentId/:stayOutgoId")
  async cancelStudentStayOutgo(
    @Param("stayId", ObjectIdPipe) stayId: Types.ObjectId,
    @Param("studentId", ObjectIdPipe) studentId: Types.ObjectId,
    @Param("stayOutgoId", ObjectIdPipe) stayOutgoId: Types.ObjectId,
  ): Promise<StayOutgoDocument> {
    return await this.stayManageService.cancelStudentStayOutgo(
      studentId,
      stayId,
      stayOutgoId,
    );
  }
}
