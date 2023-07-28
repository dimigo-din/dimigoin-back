import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseDto } from 'src/common/dto';
import { Afterschool } from 'src/common/schemas';
import { AfterschoolService } from './afterschool.service';

@Controller('afterschool')
export class AfterschoolController {
  constructor(private readonly afterschoolService: AfterschoolService) {}

  @Get()
  async getAllAfterschool(): Promise<Afterschool[]> {
    return this.afterschoolService.getAllAfterschool();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEvent(@UploadedFile() file: Express.Multer.File): Promise<ResponseDto> {
    return this.afterschoolService.uploadAfterschool(file);
  }
}
