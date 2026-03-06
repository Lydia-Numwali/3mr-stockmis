import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Lending } from '../entities/lending.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sale, Lending])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
