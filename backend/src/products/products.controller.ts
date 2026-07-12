import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService, CreateProductDto } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')  // Keep endpoint for backward compatibility
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  // Get most issued items (logistics terminology)
  @Get('most-issued')
  mostIssued(@Query('limit') limit: number) {
    return this.service.getMostIssued(limit || 10);
  }

  // Backward compatibility alias
  @Get('best-selling')
  bestSelling(@Query('limit') limit: number) {
    return this.service.getBestSelling(limit || 10);
  }
  
  // Get low stock items
  @Get('low-stock')
  lowStock() {
    return this.service.getLowStockItems();
  }
  
  // Get out of stock items
  @Get('out-of-stock')
  outOfStock() {
    return this.service.getOutOfStockItems();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: Partial<CreateProductDto>) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
