import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SalesService, CreateSaleDto, CreateBulkSaleDto } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private service: SalesService) {}

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dto: CreateBulkSaleDto) {
    return this.service.createBulk(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('revenue')
  getRevenue() {
    return this.service.getRevenueSummary();
  }
}
