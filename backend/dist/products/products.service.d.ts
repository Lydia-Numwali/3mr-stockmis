import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductCategory } from '../entities/product.entity';
export declare class CreateProductDto {
    name: string;
    category: ProductCategory;
    brand?: string;
    model?: string;
    partType?: string;
    wholesalePrice: number;
    retailPrice: number;
    costPrice: number;
    quantity: number;
    lowStockThreshold?: number;
    supplier?: string;
    storageLocation?: string;
    notes?: string;
}
export declare class ProductsService {
    private repo;
    constructor(repo: Repository<Product>);
    findAll(query: any): Promise<{
        items: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: number, dto: Partial<CreateProductDto>): Promise<Product>;
    remove(id: number): Promise<Product>;
    getBestSelling(limit?: number): Promise<any[]>;
}
