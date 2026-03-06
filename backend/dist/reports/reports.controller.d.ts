import type { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private service;
    constructor(service: ReportsService);
    getSales(query: any): Promise<{
        sales: import("../entities/sale.entity").Sale[];
        totalRevenue: number;
    }>;
    getStock(): Promise<import("../entities/product.entity").Product[]>;
    getLending(): Promise<import("../entities/lending.entity").Lending[]>;
    getIncome(): Promise<{
        dailyIncome: number;
        weeklyIncome: number;
        monthlyIncome: number;
        topSelling: any[];
    }>;
    exportSales(query: any, res: Response): Promise<void>;
    exportStock(res: Response): Promise<void>;
    exportLending(res: Response): Promise<void>;
}
