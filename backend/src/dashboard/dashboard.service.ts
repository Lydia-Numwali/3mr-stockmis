import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Purchase } from '../entities/purchase.entity';
import { Lending, LendingStatus } from '../entities/lending.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Purchase) private purchaseRepo: Repository<Purchase>,
    @InjectRepository(Lending) private lendRepo: Repository<Lending>,
  ) {}

  async getStats() {
    const [
      totalSales,
      totalPurchases,
      valueOfSales,
      valueOfPurchases,
      totalItemsInStock,
      lentProducts,
      totalProducts,
      lowStockCount,
      revenueThisMonth,
    ] = await Promise.all([
      this.saleRepo.createQueryBuilder('s').select('COALESCE(COUNT(*), 0)', 'total').getRawOne(),
      this.purchaseRepo.createQueryBuilder('p').select('COALESCE(COUNT(*), 0)', 'total').getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.totalValue), 0)', 'total').getRawOne(),
      this.purchaseRepo.createQueryBuilder('p').select('COALESCE(SUM(p.totalValue), 0)', 'total').getRawOne(),
      this.prodRepo.createQueryBuilder('p').select('COALESCE(SUM(p.quantity), 0)', 'total').getRawOne(),
      this.lendRepo.createQueryBuilder('l').select('COALESCE(SUM(l.quantityLent - l.quantityReturned), 0)', 'total').where('l.status IN (:...s)', { s: [LendingStatus.PENDING, LendingStatus.OVERDUE, LendingStatus.PARTIALLY_RETURNED] }).getRawOne(),
      // New calculations for missing fields
      this.prodRepo.createQueryBuilder('p').select('COALESCE(COUNT(*), 0)', 'total').getRawOne(),
      this.prodRepo.createQueryBuilder('p').select('COALESCE(COUNT(*), 0)', 'total').where('p.quantity <= p.lowStockThreshold').getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.totalValue), 0)', 'total').where("DATE_TRUNC('month', s.saleDate) = DATE_TRUNC('month', CURRENT_DATE)").getRawOne(),
    ]);

    const stockBalance = Number(valueOfPurchases.total) - Number(valueOfSales.total);

    return {
      // Existing fields (preserved for backward compatibility)
      totalSales: Number(totalSales.total),
      totalPurchases: Number(totalPurchases.total),
      valueOfSales: Number(valueOfSales.total),
      valueOfPurchases: Number(valueOfPurchases.total),
      stockBalance,
      totalItemsInStock: Number(totalItemsInStock.total),
      lentProducts: Number(lentProducts.total),
      
      // New fields for frontend compatibility
      totalProducts: Number(totalProducts.total),
      productsLentOut: Number(lentProducts.total), // Alias for lentProducts
      lowStockCount: Number(lowStockCount.total),
      revenueThisMonth: Number(revenueThisMonth.total),
      itemsInStock: Number(totalItemsInStock.total), // Alias for totalItemsInStock
    };
  }

  async getBestCustomers() {
    return this.saleRepo
      .createQueryBuilder('s')
      .select('s.customerName', 'customerName')
      .addSelect('COUNT(*)', 'frequency')
      .addSelect('SUM(s.totalValue)', 'totalValue')
      .where('s.customerName IS NOT NULL AND s.customerName != \'\'')
      .groupBy('s.customerName')
      .orderBy('frequency', 'DESC')
      .addOrderBy('totalValue', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getMonthlyRevenueTrend() {
    const rows = await this.saleRepo
      .createQueryBuilder('s')
      .select("DATE_TRUNC('month', s.saleDate)", 'month')
      .addSelect('SUM(s.totalValue)', 'revenue')
      .where("s.saleDate >= NOW() - INTERVAL '6 months'")
      .groupBy("DATE_TRUNC('month', s.saleDate)")
      .orderBy("DATE_TRUNC('month', s.saleDate)", 'ASC')
      .getRawMany();
    return rows;
  }

  async getCategoryBreakdown() {
    return this.prodRepo
      .createQueryBuilder('p')
      .select('p.category', 'category')
      .addSelect('COUNT(p.id)', 'count')
      .addSelect('SUM(p.quantity)', 'totalQty')
      .groupBy('p.category')
      .getRawMany();
  }

  async getLowStockAlerts() {
    return this.prodRepo.createQueryBuilder('p').where('p.quantity <= p.lowStockThreshold').orderBy('p.quantity', 'ASC').getMany();
  }
}
