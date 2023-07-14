import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateStayDto, ManageStayDto } from 'src/common/dto';
import { Stay } from 'src/common/schemas';
import { StayService } from './stay.service';

@Controller('stay')
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @Get()
  async getAllStay(): Promise<Stay[]> {
    return this.stayService.getAllStay();
  }

  @Post()
  async createStay(@Body() data: CreateStayDto): Promise<Stay> {
    return this.stayService.createStay(data);
  }

  @Post('manage')
  async manageStay(@Body() data: ManageStayDto): Promise<Stay> {
    return this.stayService.manageStay(data);
  }
}
