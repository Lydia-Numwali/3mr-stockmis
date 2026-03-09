import { SalesService, CreateSaleDto } from './sales.service';
export declare class SalesController {
    private service;
    constructor(service: SalesService);
    create(dto: CreateSaleDto): Promise<import("../entities/sale.entity").Sale>;
    findAll(query: any): Promise<{
        items: import("../entities/sale.entity").Sale[];
        total: number;
        page: number;
        limit: number;
    }>;
    getRevenue(): Promise<{
        dailyRevenue: number;
        weeklyRevenue: number;
        monthlyRevenue: number;
    }>;
}
