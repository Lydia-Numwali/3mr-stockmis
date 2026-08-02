import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Purchase } from '../entities/purchase.entity';
import { Lending } from '../entities/lending.entity';
import { ReportHistory } from '../entities/report-history.entity';
import { ReportsService } from './reports.service';
import { MonthlyInventoryReportService } from './monthly-inventory-report.service';
import { ReportHistoryService } from './report-history.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sale, Purchase, Lending, ReportHistory])],
  controllers: [ReportsController],
  providers: [ReportsService, MonthlyInventoryReportService, ReportHistoryService],
})
export class ReportsModule {}
