import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PurchasesService, CreatePurchaseDto, CreateBulkPurchaseDto } from './purchases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('purchases')  // Keep endpoint for backward compatibility
export class PurchasesController {
  constructor(private service: PurchasesService) {}

  @Post()
  create(@Body() dto: CreatePurchaseDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dto: CreateBulkPurchaseDto) {
    return this.service.createBulk(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('total')
  getTotalPurchases() {
    return this.service.getTotalPurchases();
  }
  
  // Get receiving summary
  @Get('summary')
  getReceivingSummary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.service.getReceivingSummary(from, to);
  }
  
  // Get receiving by supplier
  @Get('by-supplier')
  getReceivingBySupplier(@Query('limit') limit?: number) {
    return this.service.getReceivingBySupplier(limit || 10);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: Partial<CreatePurchaseDto>) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}