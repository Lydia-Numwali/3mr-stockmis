import { Repository, DataSource } from 'typeorm';
import { Lending } from '../entities/lending.entity';
import { Product } from '../entities/product.entity';
import { StockMovement } from '../entities/stock-movement.entity';
export declare class CreateLendingDto {
    productId: number;
    quantityLent: number;
    borrowerShop: string;
    borrowerContact?: string;
    dateLent: string;
    expectedReturnDate?: string;
    notes?: string;
}
export declare class ReturnLendingDto {
    quantityReturned: number;
    returnDate?: string;
    notes?: string;
}
export declare class LendingService {
    private lendRepo;
    private prodRepo;
    private movRepo;
    private dataSource;
    constructor(lendRepo: Repository<Lending>, prodRepo: Repository<Product>, movRepo: Repository<StockMovement>, dataSource: DataSource);
    create(dto: CreateLendingDto): Promise<Lending>;
    returnLending(id: number, dto: ReturnLendingDto): Promise<Lending>;
    findAll(query: any): Promise<{
        items: Lending[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOverdue(): Promise<Lending[]>;
    getAllForReport(): Promise<Lending[]>;
}
