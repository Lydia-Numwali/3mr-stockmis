import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Purchase } from '../entities/purchase.entity';
import { Sale } from '../entities/sale.entity';
import { Lending } from '../entities/lending.entity';

export interface MonthlyInventoryItem {
  sn: number;
  item: string;
  supplierName: string;
  openingBalance: number;
  received: number;
  returns: number;
  issued: number;
  closingBalance: number;
  units: string;
  status: string;
}

@Injectable()
export class MonthlyInventoryReportService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Purchase) private purchaseRepo: Repository<Purchase>,
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Lending) private lendingRepo: Repository<Lending>,
  ) {}

  /**
   * Generate monthly inventory report
   * Only includes items with activity (received, issued, returned) during the month
   * @param month - Month number (1-12)
   * @param year - Year (e.g., 2026)
   */
  async generateMonthlyReport(month: number, year: number): Promise<MonthlyInventoryItem[]> {
    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1); // First day of month
    const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month
    const previousMonthEnd = new Date(year, month - 1, 0, 23, 59, 59); // End of previous month

    // Get products with activity during the month
    const productsWithActivity = await this.getProductsWithActivity(startDate, endDate);

    const report: MonthlyInventoryItem[] = [];

    for (let i = 0; i < productsWithActivity.length; i++) {
      const product = productsWithActivity[i];

      // Calculate opening balance (quantity at end of previous month)
      const openingBalance = await this.calculateOpeningBalance(product.id, previousMonthEnd);

      // Calculate received during the month
      const received = await this.calculateReceived(product.id, startDate, endDate);

      // Calculate returns during the month
      const returns = await this.calculateReturns(product.id, startDate, endDate);

      // Calculate issued during the month
      const issued = await this.calculateIssued(product.id, startDate, endDate);

      // Calculate closing balance
      const closingBalance = openingBalance + received + returns - issued;

      report.push({
        sn: i + 1,
        item: product.name,
        supplierName: product.supplier || '-',
        openingBalance,
        received,
        returns,
        issued,
        closingBalance,
        units: product.packagingUnit || 'Pieces',
        status: product.condition || 'New',
      });
    }

    return report;
  }

  /**
   * Get products that had any activity during the specified date range
   */
  private async getProductsWithActivity(startDate: Date, endDate: Date): Promise<Product[]> {
    // Get products with purchases during the month
    const purchasedProductIds = await this.purchaseRepo
      .createQueryBuilder('p')
      .select('DISTINCT p.productId', 'productId')
      .where('((p.receivingDate >= :startDate AND p.receivingDate <= :endDate) OR (p.date >= :startDate AND p.date <= :endDate))',
        { startDate, endDate })
      .getRawMany();

    // Get products with sales during the month
    const soldProductIds = await this.saleRepo
      .createQueryBuilder('s')
      .select('DISTINCT s.productId', 'productId')
      .where('((s.issueDate >= :startDate AND s.issueDate <= :endDate) OR (s.date >= :startDate AND s.date <= :endDate))',
        { startDate, endDate })
      .getRawMany();

    // Get products with returns during the month
    const returnedProductIds = await this.lendingRepo
      .createQueryBuilder('l')
      .select('DISTINCT l.productId', 'productId')
      .where('l.returnDate >= :startDate AND l.returnDate <= :endDate',
        { startDate, endDate })
      .getRawMany();

    // Combine all product IDs
    const allProductIds = new Set<number>();
    purchasedProductIds.forEach(p => allProductIds.add(p.productId));
    soldProductIds.forEach(p => allProductIds.add(p.productId));
    returnedProductIds.forEach(p => allProductIds.add(p.productId));

    if (allProductIds.size === 0) {
      return [];
    }

    // Get the actual product details
    const products = await this.productRepo
      .createQueryBuilder('product')
      .whereInIds(Array.from(allProductIds))
      .orderBy('product.id', 'ASC')
      .getMany();

    return products;
  }

  /**
   * Calculate opening balance (stock at end of previous month)
   */
  private async calculateOpeningBalance(productId: number, endDate: Date): Promise<number> {
    // Get all purchases up to end date
    const purchases = await this.purchaseRepo
      .createQueryBuilder('p')
      .where('p.productId = :productId', { productId })
      .andWhere('(p.receivingDate <= :endDate OR p.date <= :endDate)', { endDate })
      .select('COALESCE(SUM(p.quantityReceived), 0)', 'total')
      .getRawOne();

    const totalReceived = Number(purchases?.total || 0);

    // Get all sales up to end date
    const sales = await this.saleRepo
      .createQueryBuilder('s')
      .where('s.productId = :productId', { productId })
      .andWhere('(s.issueDate <= :endDate OR s.date <= :endDate)', { endDate })
      .select('COALESCE(SUM(s.quantityIssued), 0)', 'total')
      .getRawOne();

    const totalIssued = Number(sales?.total || 0);

    return totalReceived - totalIssued;
  }

  /**
   * Calculate quantity received during the month
   */
  private async calculateReceived(productId: number, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.purchaseRepo
      .createQueryBuilder('p')
      .where('p.productId = :productId', { productId })
      .andWhere('((p.receivingDate >= :startDate AND p.receivingDate <= :endDate) OR (p.date >= :startDate AND p.date <= :endDate))', 
        { startDate, endDate })
      .select('COALESCE(SUM(p.quantityReceived), 0)', 'total')
      .getRawOne();

    return Number(result?.total || 0);
  }

  /**
   * Calculate quantity returned during the month
   */
  private async calculateReturns(productId: number, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.lendingRepo
      .createQueryBuilder('l')
      .where('l.productId = :productId', { productId })
      .andWhere('l.returnDate >= :startDate AND l.returnDate <= :endDate', { startDate, endDate })
      .select('COALESCE(SUM(l.quantityReturned), 0)', 'total')
      .getRawOne();

    return Number(result?.total || 0);
  }

  /**
   * Calculate quantity issued during the month
   */
  private async calculateIssued(productId: number, startDate: Date, endDate: Date): Promise<number> {
    const result = await this.saleRepo
      .createQueryBuilder('s')
      .where('s.productId = :productId', { productId })
      .andWhere('(s.issueDate >= :startDate AND s.issueDate <= :endDate) OR (s.date >= :startDate AND s.date <= :endDate)', 
        { startDate, endDate })
      .select('COALESCE(SUM(s.quantityIssued), 0)', 'total')
      .getRawOne();

    return Number(result?.total || 0);
  }

  /**
   * Generate report data grouped by status (New Items, Old Items)
   * Only includes items with activity during the month
   */
  async generateGroupedMonthlyReport(month: number, year: number) {
    const allItems = await this.generateMonthlyReport(month, year);

    // Group by status - already filtered to only items with activity
    const newItems = allItems.filter(item => 
      item.status.toLowerCase().includes('new')
    );

    const usedItems = allItems.filter(item => 
      !item.status.toLowerCase().includes('new') || item.status.toLowerCase().includes('used')
    );

    return {
      month,
      year,
      monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
      newItems,
      usedItems,
      totalNewItems: newItems.length,
      totalUsedItems: usedItems.length,
    };
  }
}
