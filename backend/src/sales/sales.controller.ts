import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { SalesService, CreateSaleDto, CreateBulkSaleDto } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sales')  // Keep endpoint for backward compatibility
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

  // Get issue summary (logistics terminology)
  @Get('issue-summary')
  getIssueSummary() {
    return this.service.getIssueSummary();
  }

  // Backward compatibility alias
  @Get('revenue')
  getRevenue() {
    return this.service.getRevenueSummary();
  }
  
  // Get issue by department
  @Get('by-department')
  getIssueByDepartment(@Query('limit') limit?: number) {
    return this.service.getIssueByDepartment(limit || 10);
  }
  
  // Get issue by security site
  @Get('by-site')
  getIssueBySite(@Query('limit') limit?: number) {
    return this.service.getIssueBySite(limit || 10);
  }
}

