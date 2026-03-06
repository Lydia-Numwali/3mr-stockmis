import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lending } from '../entities/lending.entity';
import { Product } from '../entities/product.entity';
import { StockMovement } from '../entities/stock-movement.entity';
import { LendingService } from './lending.service';
import { LendingController } from './lending.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lending, Product, StockMovement])],
  controllers: [LendingController],
  providers: [LendingService],
  exports: [LendingService],
})
export class LendingModule {}
