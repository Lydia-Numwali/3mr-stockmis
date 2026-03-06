import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Lending } from '../entities/lending.entity';
export declare class ReportsService {
    private prodRepo;
    private saleRepo;
    private lendRepo;
    constructor(prodRepo: Repository<Product>, saleRepo: Repository<Sale>, lendRepo: Repository<Lending>);
    getSalesReport(query: any): Promise<{
        sales: Sale[];
        totalRevenue: number;
    }>;
    getStockReport(): Promise<Product[]>;
    getLendingReport(): Promise<Lending[]>;
    getIncomeReport(): Promise<{
        dailyIncome: number;
        weeklyIncome: number;
        monthlyIncome: number;
        topSelling: any[];
    }>;
    exportSalesToExcel(query: any): Promise<Buffer>;
    exportStockToExcel(): Promise<Buffer>;
    exportLendingToExcel(): Promise<Buffer>;
}
