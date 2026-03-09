import { Product } from './product.entity';
export declare enum LendingStatus {
    PENDING = "PENDING",
    PARTIALLY_RETURNED = "PARTIALLY_RETURNED",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE"
}
export declare class Lending {
    id: number;
    product: Product;
    productId: number;
    quantityLent: number;
    quantityReturned: number;
    borrowerShop: string;
    borrowerContact: string;
    dateLent: Date;
    expectedReturnDate: Date;
    returnDate: Date;
    status: LendingStatus;
    notes: string;
    createdAt: Date;
}
