import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
    getStats(): Promise<{
        totalProducts: number;
        totalStock: number;
        lowStockCount: number;
        lowStockProducts: import("../entities/product.entity").Product[];
        productsLentOut: number;
        soldToday: number;
        revenueToday: number;
        revenueThisMonth: number;
    }>;
    getRevenueTrend(): Promise<any[]>;
    getCategoryBreakdown(): Promise<any[]>;
    getLowStock(): Promise<import("../entities/product.entity").Product[]>;
}
