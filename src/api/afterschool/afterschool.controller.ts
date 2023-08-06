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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ResponseDto } from 'src/common/dto';
import { ManageAfterschoolDto } from 'src/common/dto/afterschoool.dto';
import {
  Afterschool,
  AfterschoolApplication,
  StudentDocument,
} from 'src/common/schemas';
import { AfterschoolService } from './afterschool.service';

@Controller('afterschool')
export class AfterschoolController {
  constructor(private readonly afterschoolService: AfterschoolService) {}

  @Get()
  async getAllAfterschool(): Promise<Afterschool[]> {
    return this.afterschoolService.getAllAfterschool();
  }

  @Get('/user')
  async getAfterschoolByUser(@Req() req: Request): Promise<Afterschool[]> {
    return this.afterschoolService.getAfterschoolByUser(
      req.user as StudentDocument,
    );
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvent(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return this.afterschoolService.uploadAfterschool(file);
  }

  @Get(':id')
  async getAfterschoolById(@Param('id') id: string): Promise<Afterschool> {
    return this.afterschoolService.getAfterschoolById(id);
  }

  @Post()
  async createAfterschoolById(
    @Body() data: ManageAfterschoolDto,
  ): Promise<Afterschool> {
    return this.afterschoolService.createAfterschoolById(data);
  }

  @Patch(':id')
  async manageAfterschoolById(
    @Param('id') id: string,
    @Body() data: ManageAfterschoolDto,
  ): Promise<Afterschool> {
    return this.afterschoolService.manageAfterschoolById(id, data);
  }

  @Delete(':id')
  async deleteAfterschoolById(@Param('id') id: string): Promise<Afterschool> {
    return this.afterschoolService.deleteAfterschoolById(id);
  }

  // Afterschool Application

  @Get('application')
  async getAllApplication(): Promise<AfterschoolApplication[]> {
    return this.afterschoolService.getAllApplication();
  }

  @Get('application/:id')
  async getApplicationById(
    @Param('id') id: string,
  ): Promise<AfterschoolApplication> {
    return this.afterschoolService.getApplicationById(id);
  }

  @Post('application/:id')
  async createApplication(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AfterschoolApplication> {
    return this.afterschoolService.createApplication(
      id,
      req.user as StudentDocument,
    );
  }

  @Delete('application/:id')
  async cancelApplication(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    return this.afterschoolService.cancelApplication(
      id,
      req.user as StudentDocument,
    );
  }
}
