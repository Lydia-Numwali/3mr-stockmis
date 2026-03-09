import { Repository, DataSource } from 'typeorm';
import { Sale, SaleType, CustomerType } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { StockMovement } from '../entities/stock-movement.entity';
export declare class CreateSaleDto {
    productId: number;
    quantitySold: number;
    saleType: SaleType;
    priceUsed: number;
    customerType?: CustomerType;
    notes?: string;
}
export declare class SalesService {
    private saleRepo;
    private prodRepo;
    private movRepo;
    private dataSource;
    constructor(saleRepo: Repository<Sale>, prodRepo: Repository<Product>, movRepo: Repository<StockMovement>, dataSource: DataSource);
    create(dto: CreateSaleDto): Promise<Sale>;
    findAll(query: any): Promise<{
        items: Sale[];
        total: number;
        page: number;
        limit: number;
    }>;
    getRevenueSummary(): Promise<{
        dailyRevenue: number;
        weeklyRevenue: number;
        monthlyRevenue: number;
    }>;
    getSalesForReport(query: any): Promise<Sale[]>;
}
