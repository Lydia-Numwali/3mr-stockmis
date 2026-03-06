import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Sale } from '../entities/sale.entity';
import { Lending } from '../entities/lending.entity';
export declare class DashboardService {
    private prodRepo;
    private saleRepo;
    private lendRepo;
    constructor(prodRepo: Repository<Product>, saleRepo: Repository<Sale>, lendRepo: Repository<Lending>);
    getStats(): Promise<{
        totalProducts: number;
        totalStock: number;
        lowStockCount: number;
        lowStockProducts: Product[];
        productsLentOut: number;
        soldToday: number;
        revenueToday: number;
        revenueThisMonth: number;
    }>;
    getMonthlyRevenueTrend(): Promise<any[]>;
    getCategoryBreakdown(): Promise<any[]>;
    getLowStockAlerts(): Promise<Product[]>;
}
