import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ResponseDto } from 'src/common/dto';
import { ManageAfterschoolDto } from 'src/common/dto/afterschoool.dto';
import { EditPermissionGuard, ViewPermissionGuard } from 'src/common/guard';
import {
  Afterschool,
  AfterschoolApplication,
  AfterschoolApplicationDocument,
  AfterschoolApplicationResponse,
  AfterschoolDocument,
  StudentDocument,
} from 'src/common/schemas';
import { AfterschoolService } from './afterschool.service';

@Controller('afterschool')
export class AfterschoolController {
  constructor(private readonly afterschoolService: AfterschoolService) {}

  @Get()
  async getAllAfterschool(): Promise<AfterschoolDocument[]> {
    return await this.afterschoolService.getAllAfterschool();
  }

  @Get('/user')
  async getAfterschoolByUser(
    @Req() req: Request,
  ): Promise<AfterschoolDocument[]> {
    return await this.afterschoolService.getAfterschoolByUser(
      req.user as StudentDocument,
    );
  }

  @UseGuards(EditPermissionGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return await this.afterschoolService.uploadAfterschool(file);
  }

  @Get(':id')
  async getAfterschoolById(
    @Param('id') id: string,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.getAfterschoolById(id);
  }

  @UseGuards(EditPermissionGuard)
  @Post()
  async createAfterschoolById(
    @Body() data: ManageAfterschoolDto,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.createAfterschoolById(data);
  }

  @UseGuards(EditPermissionGuard)
  @Patch(':id')
  async manageAfterschoolById(
    @Param('id') id: string,
    @Body() data: ManageAfterschoolDto,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.manageAfterschoolById(id, data);
  }

  @UseGuards(EditPermissionGuard)
  @Delete(':id')
  async deleteAfterschoolById(
    @Param('id') id: string,
  ): Promise<AfterschoolDocument> {
    return await this.afterschoolService.deleteAfterschoolById(id);
  }

  // Afterschool Application
  @Get('application')
  async getAllApplication(): Promise<AfterschoolApplicationDocument[]> {
    return await this.afterschoolService.getAllApplication();
  }

  @Get('application/my')
  async getMyApplication(
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument[]> {
    return await this.afterschoolService.getMyApplication(
      req.user as StudentDocument,
    );
  }

  @Get('application/:id')
  async getApplicationById(
    @Param('id') id: string,
  ): Promise<AfterschoolApplicationResponse> {
    return await this.afterschoolService.getApplicationById(id);
  }

  @Post('application/:id')
  async createApplication(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AfterschoolApplicationDocument> {
    return await this.afterschoolService.createApplication(
      id,
      req.user as StudentDocument,
    );
  }

  @Delete('application/:id')
  async cancelApplication(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    return await this.afterschoolService.cancelApplication(
      id,
      req.user as StudentDocument,
    );
  }
}
