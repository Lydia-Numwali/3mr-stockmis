import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { StockService, AddStockDto } from './stock.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stock')
export class StockController {
  constructor(private service: StockService) {}

  @Post('add')
  addStock(@Body() dto: AddStockDto) {
    return this.service.addStock(dto);
  }

  @Get('movements')
  getMovements(@Query() query: any) {
    return this.service.getMovements(query);
  }
}
