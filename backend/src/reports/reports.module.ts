import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Purchase } from '../entities/purchase.entity';
import { Lending } from '../entities/lending.entity';
import { ReportsService } from './reports.service';
import { MonthlyInventoryReportService } from './monthly-inventory-report.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sale, Purchase, Lending])],
  controllers: [ReportsController],
  providers: [ReportsService, MonthlyInventoryReportService],
})
export class ReportsModule {}
