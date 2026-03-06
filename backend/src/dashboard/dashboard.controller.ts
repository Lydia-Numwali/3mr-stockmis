import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('stats')
  getStats() { return this.service.getStats(); }

  @Get('revenue-trend')
  getRevenueTrend() { return this.service.getMonthlyRevenueTrend(); }

  @Get('category-breakdown')
  getCategoryBreakdown() { return this.service.getCategoryBreakdown(); }

  @Get('low-stock')
  getLowStock() { return this.service.getLowStockAlerts(); }
}
