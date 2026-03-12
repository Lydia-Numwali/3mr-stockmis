import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { Purchase } from '../entities/purchase.entity';
import { Product } from '../entities/product.entity';
import { StockMovement } from '../entities/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, Product, StockMovement])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}