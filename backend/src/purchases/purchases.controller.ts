import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { PurchasesService, CreatePurchaseDto } from './purchases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private service: PurchasesService) {}

  @Post()
  create(@Body() dto: CreatePurchaseDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('total')
  getTotalPurchases() {
    return this.service.getTotalPurchases();
  }
}