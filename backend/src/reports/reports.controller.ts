import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private service: ReportsService) {}

  @Get('sales')
  getSales(@Query() query: any) { return this.service.getSalesReport(query); }

  @Get('stock')
  getStock(@Query() query: any) { return this.service.getStockReport(query); }

  @Get('lending')
  getLending(@Query() query: any) { return this.service.getLendingReport(query); }

  @Get('income')
  getIncome(@Query() query: any) { return this.service.getIncomeReport(query); }

  @Get('export/sales')
  async exportSales(@Query() query: any, @Res() res: Response) {
    const buffer = await this.service.exportSalesToExcel(query);
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="sales-report.xlsx"' });
    res.send(buffer);
  }

  @Get('export/stock')
  async exportStock(@Query() query: any, @Res() res: Response) {
    const buffer = await this.service.exportStockToExcel(query);
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="stock-report.xlsx"' });
    res.send(buffer);
  }

  @Get('export/lending')
  async exportLending(@Query() query: any, @Res() res: Response) {
    const buffer = await this.service.exportLendingToExcel(query);
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="lending-report.xlsx"' });
    res.send(buffer);
  }
}
