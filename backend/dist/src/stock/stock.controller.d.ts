import { StockService, AddStockDto } from './stock.service';
export declare class StockController {
    private service;
    constructor(service: StockService);
    addStock(dto: AddStockDto): Promise<import("../entities/stock-movement.entity").StockMovement>;
    getMovements(query: any): Promise<{
        items: import("../entities/stock-movement.entity").StockMovement[];
        total: number;
        page: number;
        limit: number;
    }>;
}
