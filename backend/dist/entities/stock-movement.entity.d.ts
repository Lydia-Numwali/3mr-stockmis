import { Product } from './product.entity';
export declare enum MovementType {
    IN = "IN",
    OUT = "OUT",
    LEND = "LEND",
    RETURN = "RETURN"
}
export declare class StockMovement {
    id: number;
    product: Product;
    productId: number;
    type: MovementType;
    quantity: number;
    supplier: string;
    purchasePrice: number;
    notes: string;
    date: Date;
}
