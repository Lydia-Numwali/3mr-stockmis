import { Product } from './product.entity';
export declare enum SaleType {
    RETAIL = "RETAIL",
    WHOLESALE = "WHOLESALE"
}
export declare enum CustomerType {
    INDIVIDUAL = "INDIVIDUAL",
    SHOP_OWNER = "SHOP_OWNER"
}
export declare class Sale {
    id: number;
    product: Product;
    productId: number;
    quantitySold: number;
    saleType: SaleType;
    priceUsed: number;
    customerType: CustomerType;
    notes: string;
    totalValue: number;
    date: Date;
}
