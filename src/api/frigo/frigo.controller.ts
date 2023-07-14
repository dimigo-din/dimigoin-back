import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FrigoDocument, StudentDocument } from 'src/common/schemas';
import { FrigoService } from './frigo.service';
import { ManageFrigoDto, RequestFrigoDto } from 'src/common/dto';
import { Request } from 'express';
import { StudentOnlyGuard, TeacherOnlyGuard } from 'src/common/guard';

@Controller('frigo')
export class FrigoController {
  constructor(private readonly frigoService: FrigoService) {}

  @UseGuards(TeacherOnlyGuard)
  @Get()
  async getAllFrigoRequests(): Promise<FrigoDocument[]> {
    return this.frigoService.getAllFrigo();
  }

  @UseGuards(StudentOnlyGuard)
  @Get('my')
  async getMyFrigo(@Req() req: Request): Promise<FrigoDocument> {
    return this.frigoService.getMyFrigo(req.user as StudentDocument);
  }

  @UseGuards(StudentOnlyGuard)
  @Post()
  async requestFrigo(
    @Body() data: RequestFrigoDto,
    @Req() req: Request,
  ): Promise<FrigoDocument> {
    return this.frigoService.requestFrigo(data, req.user as StudentDocument);
  }

  @UseGuards(TeacherOnlyGuard)
  @Post('manage')
  async manageFrigo(@Body() data: ManageFrigoDto): Promise<FrigoDocument> {
    return this.frigoService.manageFrigo(data);
  }
}
