import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Lending, LendingStatus } from '../entities/lending.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Lending) private lendRepo: Repository<Lending>,
  ) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalProducts,
      totalStockRow,
      lowStockProducts,
      productsLentOut,
      soldTodayRow,
      revenueTodayRow,
      revenueMonthRow,
    ] = await Promise.all([
      this.prodRepo.count(),
      this.prodRepo.createQueryBuilder('p').select('COALESCE(SUM(p.quantity), 0)', 'total').getRawOne(),
      this.prodRepo.createQueryBuilder('p').where('p.quantity <= p.lowStockThreshold').getMany(),
      this.lendRepo.createQueryBuilder('l').select('COALESCE(SUM(l.quantityLent - l.quantityReturned), 0)', 'total').where('l.status IN (:...s)', { s: [LendingStatus.PENDING, LendingStatus.OVERDUE, LendingStatus.PARTIALLY_RETURNED] }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold), 0)', 'total').where('s.date >= :today', { today }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :today', { today }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfMonth', { startOfMonth }).getRawOne(),
    ]);

    return {
      totalProducts,
      totalStock: Number(totalStockRow.total),
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      productsLentOut: Number(productsLentOut.total),
      soldToday: Number(soldTodayRow.total),
      revenueToday: Number(revenueTodayRow.total),
      revenueThisMonth: Number(revenueMonthRow.total),
    };
  }

  async getMonthlyRevenueTrend() {
    const rows = await this.saleRepo
      .createQueryBuilder('s')
      .select("DATE_TRUNC('month', s.date)", 'month')
      .addSelect('SUM(s.quantitySold * s.priceUsed)', 'revenue')
      .where("s.date >= NOW() - INTERVAL '6 months'")
      .groupBy("DATE_TRUNC('month', s.date)")
      .orderBy("DATE_TRUNC('month', s.date)", 'ASC')
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
