import { Controller, Get } from '@nestjs/common';
import { Stay } from 'src/common/schemas';
import { StayService } from './stay.service';

@Controller('stay')
export class StayController {
  constructor(private readonly stayService: StayService) {}

  @Get()
  async getAllStay(): Promise<Stay[]> {
    return this.stayService.getAllStay();
  }
}
