import { Repository, DataSource } from 'typeorm';
import { StockMovement } from '../entities/stock-movement.entity';
import { Product } from '../entities/product.entity';
export declare class AddStockDto {
    productId: number;
    quantity: number;
    purchasePrice?: number;
    supplier?: string;
    notes?: string;
}
export declare class StockService {
    private movRepo;
    private prodRepo;
    private dataSource;
    constructor(movRepo: Repository<StockMovement>, prodRepo: Repository<Product>, dataSource: DataSource);
    addStock(dto: AddStockDto): Promise<StockMovement>;
    getMovements(query: any): Promise<{
        items: StockMovement[];
        total: number;
        page: number;
        limit: number;
    }>;
}
