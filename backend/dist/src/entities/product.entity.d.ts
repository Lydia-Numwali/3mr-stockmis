import { Sale } from './sale.entity';
import { StockMovement } from './stock-movement.entity';
import { Lending } from './lending.entity';
export declare enum ProductCategory {
    ENGINE_PARTS = "Engine Parts",
    BRAKE_SYSTEM = "Brake System",
    ELECTRICAL_PARTS = "Electrical Parts",
    BODY_PARTS = "Body Parts",
    SUSPENSION = "Suspension",
    TIRES_WHEELS = "Tires & Wheels",
    OTHER = "Other"
}
export declare enum PackagingUnit {
    PIECES = "Pieces",
    CARTON = "Carton",
    LITRE = "Litre",
    KILOGRAM = "Kilogram",
    BOX = "Box",
    PACK = "Pack",
    BOTTLE = "Bottle",
    CAN = "Can",
    GALLON = "Gallon",
    METER = "Meter",
    SET = "Set",
    PAIR = "Pair"
}
export declare class Product {
    id: number;
    name: string;
    category: ProductCategory;
    packagingUnit: PackagingUnit;
    unitsPerPackage: number;
    brand: string;
    model: string;
    partType: string;
    wholesalePrice: number;
    retailPrice: number;
    costPrice: number;
    quantity: number;
    lowStockThreshold: number;
    supplier: string;
    storageLocation: string;
    notes: string;
    dateRecorded: Date;
    updatedAt: Date;
    sales: Sale[];
    movements: StockMovement[];
    lendings: Lending[];
}
