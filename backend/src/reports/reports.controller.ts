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
  getStock() { return this.service.getStockReport(); }

  @Get('lending')
  getLending() { return this.service.getLendingReport(); }

  @Get('income')
  getIncome() { return this.service.getIncomeReport(); }

  @Get('export/sales')
  async exportSales(@Query() query: any, @Res() res: Response) {
    const buffer = await this.service.exportSalesToExcel(query);
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="sales-report.xlsx"' });
    res.send(buffer);
  }

  @Get('export/stock')
  async exportStock(@Res() res: Response) {
    const buffer = await this.service.exportStockToExcel();
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="stock-report.xlsx"' });
    res.send(buffer);
  }

  @Get('export/lending')
  async exportLending(@Res() res: Response) {
    const buffer = await this.service.exportLendingToExcel();
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="lending-report.xlsx"' });
    res.send(buffer);
  }
}
