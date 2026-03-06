import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LendingService, CreateLendingDto, ReturnLendingDto } from './lending.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('lending')
export class LendingController {
  constructor(private service: LendingService) {}

  @Post()
  create(@Body() dto: CreateLendingDto) {
    return this.service.create(dto);
  }

  @Put(':id/return')
  returnLending(@Param('id') id: number, @Body() dto: ReturnLendingDto) {
    return this.service.returnLending(+id, dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('overdue')
  getOverdue() {
    return this.service.getOverdue();
  }
}
