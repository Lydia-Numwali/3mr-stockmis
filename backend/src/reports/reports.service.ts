import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Lending } from '../entities/lending.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product) private prodRepo: Repository<Product>,
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
    @InjectRepository(Lending) private lendRepo: Repository<Lending>,
  ) {}

  async getSalesReport(query: any) {
    const { from, to, saleType } = query;
    const qb = this.saleRepo.createQueryBuilder('s').leftJoinAndSelect('s.product', 'p');
    if (from) qb.andWhere('s.date >= :from', { from });
    if (to) qb.andWhere('s.date <= :to', { to: to + ' 23:59:59' });
    if (saleType) qb.andWhere('s.saleType = :saleType', { saleType });
    const sales = await qb.orderBy('s.date', 'DESC').getMany();
    const totalRevenue = sales.reduce((acc, s) => acc + s.quantitySold * Number(s.priceUsed), 0);
    return { sales, totalRevenue };
  }

  async getStockReport() {
    const products = await this.prodRepo.find({ order: { name: 'ASC' } });
    return products;
  }

  async getLendingReport() {
    return this.lendRepo.createQueryBuilder('l').leftJoinAndSelect('l.product', 'p').orderBy('l.createdAt', 'DESC').getMany();
  }

  async getIncomeReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [daily, weekly, monthly, topSelling] = await Promise.all([
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :today', { today }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfWeek', { startOfWeek }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('COALESCE(SUM(s.quantitySold * s.priceUsed), 0)', 'total').where('s.date >= :startOfMonth', { startOfMonth }).getRawOne(),
      this.saleRepo.createQueryBuilder('s').select('p.id', 'productId').addSelect('p.name', 'productName').addSelect('SUM(s.quantitySold)', 'totalSold').addSelect('SUM(s.quantitySold * s.priceUsed)', 'totalRevenue').leftJoin('s.product', 'p').groupBy('p.id').addGroupBy('p.name').orderBy('SUM(s.quantitySold)', 'DESC').limit(10).getRawMany(),
    ]);

    return {
      dailyIncome: Number(daily.total),
      weeklyIncome: Number(weekly.total),
      monthlyIncome: Number(monthly.total),
      topSelling,
    };
  }

  async exportSalesToExcel(query: any): Promise<Buffer> {
    const { sales } = await this.getSalesReport(query);
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Sales Report');
    ws.columns = [
      { header: 'Sale ID', key: 'id', width: 10 },
      { header: 'Product', key: 'product', width: 30 },
      { header: 'Qty Sold', key: 'qty', width: 12 },
      { header: 'Sale Type', key: 'saleType', width: 15 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Total Value', key: 'total', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
    ];
    sales.forEach((s) => {
      ws.addRow({ id: s.id, product: s.product?.name, qty: s.quantitySold, saleType: s.saleType, price: s.priceUsed, total: s.quantitySold * Number(s.priceUsed), date: new Date(s.date).toLocaleString() });
    });
    return (wb.xlsx.writeBuffer() as unknown) as Promise<Buffer>;
  }

  async exportStockToExcel(): Promise<Buffer> {
    const products = await this.getStockReport();
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Stock Report');
    ws.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Brand', key: 'brand', width: 15 },
      { header: 'Qty', key: 'qty', width: 10 },
      { header: 'Cost Price', key: 'cost', width: 15 },
      { header: 'Retail Price', key: 'retail', width: 15 },
      { header: 'Wholesale Price', key: 'wholesale', width: 15 },
      { header: 'Supplier', key: 'supplier', width: 20 },
    ];
    products.forEach((p) => {
      ws.addRow({ id: p.id, name: p.name, category: p.category, brand: p.brand, qty: p.quantity, cost: p.costPrice, retail: p.retailPrice, wholesale: p.wholesalePrice, supplier: p.supplier });
    });
    return (wb.xlsx.writeBuffer() as unknown) as Promise<Buffer>;
  }

  async exportLendingToExcel(): Promise<Buffer> {
    const lendings = await this.getLendingReport();
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Lending Report');
    ws.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Product', key: 'product', width: 30 },
      { header: 'Borrower Shop', key: 'shop', width: 25 },
      { header: 'Qty Lent', key: 'lent', width: 12 },
      { header: 'Qty Returned', key: 'returned', width: 15 },
      { header: 'Remaining', key: 'remaining', width: 12 },
      { header: 'Date Lent', key: 'dateLent', width: 15 },
      { header: 'Expected Return', key: 'expected', width: 18 },
      { header: 'Status', key: 'status', width: 15 },
    ];
    lendings.forEach((l) => {
      ws.addRow({ id: l.id, product: l.product?.name, shop: l.borrowerShop, lent: l.quantityLent, returned: l.quantityReturned, remaining: l.quantityLent - l.quantityReturned, dateLent: l.dateLent, expected: l.expectedReturnDate, status: l.status });
    });
    return (wb.xlsx.writeBuffer() as unknown) as Promise<Buffer>;
  }
}
