import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { MonthlyInventoryReportService } from './monthly-inventory-report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as ExcelJS from 'exceljs';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private service: ReportsService,
    private monthlyInventoryService: MonthlyInventoryReportService,
  ) {}

  @Get('sales')
  getSales(@Query() query: any) { return this.service.getSalesReport(query); }

  @Get('stock')
  getStock(@Query() query: any) { return this.service.getStockReport(query); }

  @Get('lending')
  getLending(@Query() query: any) { return this.service.getLendingReport(query); }

  @Get('income')
  getIncome(@Query() query: any) { return this.service.getIncomeReport(query); }

  // Monthly Inventory Report
  @Get('monthly-inventory')
  async getMonthlyInventory(@Query('month') month: string, @Query('year') year: string) {
    const monthNum = month ? parseInt(month) : new Date().getMonth() + 1;
    const yearNum = year ? parseInt(year) : new Date().getFullYear();
    return this.monthlyInventoryService.generateGroupedMonthlyReport(monthNum, yearNum);
  }

  @Get('export/monthly-inventory')
  async exportMonthlyInventory(
    @Query('month') month: string, 
    @Query('year') year: string,
    @Res() res: Response
  ) {
    const monthNum = month ? parseInt(month) : new Date().getMonth() + 1;
    const yearNum = year ? parseInt(year) : new Date().getFullYear();
    
    const data = await this.monthlyInventoryService.generateGroupedMonthlyReport(monthNum, yearNum);
    
    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('New Items');
    const oldItemsSheet = workbook.addWorksheet('Old Items');

    // Title
    worksheet.mergeCells('A1:J1');
    worksheet.getCell('A1').value = `INVENTORY REPORT FOR ${data.monthName.toUpperCase()}, ${data.year}`;
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Headers
    worksheet.getRow(2).values = [
      'SN', 'ITEM', 'SUPPLIER NAME', 'OPENING INV BALANCE', 
      'RECEIVED', 'RETURNS', 'ISSUED', 'CLOSING BALANCE', 'UNITS', 'STATUS'
    ];
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' }
    };

    // Add new items data
    data.newItems.forEach((item, index) => {
      worksheet.addRow([
        item.sn,
        item.item,
        item.supplierName,
        item.openingBalance,
        item.received,
        item.returns,
        item.issued,
        item.closingBalance,
        item.units,
        item.status,
      ]);
    });

    // Old items sheet
    oldItemsSheet.mergeCells('A1:C1');
    oldItemsSheet.getCell('A1').value = 'ASSORTED OLD STOCK';
    oldItemsSheet.getCell('A1').font = { bold: true, size: 14 };
    oldItemsSheet.getCell('A1').alignment = { horizontal: 'center' };

    oldItemsSheet.getRow(2).values = ['USED ITEMS', 'QUANTITY', 'UNITS'];
    oldItemsSheet.getRow(2).font = { bold: true };

    data.usedItems.forEach(item => {
      oldItemsSheet.addRow([item.item, item.closingBalance, item.units]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="inventory-report-${data.monthName}-${data.year}.xlsx"`
    });
    res.send(buffer);
  }

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
