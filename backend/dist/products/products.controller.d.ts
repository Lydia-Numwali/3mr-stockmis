import { ProductsService, CreateProductDto } from './products.service';
export declare class ProductsController {
    private service;
    constructor(service: ProductsService);
    findAll(query: any): Promise<{
        items: import("../entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    bestSelling(limit: number): Promise<any[]>;
    findOne(id: number): Promise<import("../entities/product.entity").Product>;
    create(dto: CreateProductDto): Promise<import("../entities/product.entity").Product>;
    update(id: number, dto: Partial<CreateProductDto>): Promise<import("../entities/product.entity").Product>;
    remove(id: number): Promise<import("../entities/product.entity").Product>;
}
