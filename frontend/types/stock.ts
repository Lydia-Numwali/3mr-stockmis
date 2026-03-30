export enum SaleType {
    WHOLESALE = 'WHOLESALE',
    RETAIL = 'RETAIL'
}

export enum CustomerType {
    NEW = 'NEW',
    RETURNING = 'RETURNING',
    REGULAR = 'REGULAR',
    INDIVIDUAL = 'INDIVIDUAL',
    SHOP_OWNER = 'SHOP_OWNER'
}

export enum ProductCategory {
    ENGINE_PARTS = 'Engine Parts',
    BRAKE_SYSTEM = 'Brake System',
    ELECTRICAL_PARTS = 'Electrical Parts',
    BODY_PARTS = 'Body Parts',
    SUSPENSION = 'Suspension',
    TIRES_WHEELS = 'Tires & Wheels',
    OTHER = 'Other',
}

export enum PackagingUnit {
    PIECES = 'Pieces',
    CARTON = 'Carton',
    LITRE = 'Litre',
    KILOGRAM = 'Kilogram',
    BOX = 'Box',
    PACK = 'Pack',
    BOTTLE = 'Bottle',
    CAN = 'Can',
    GALLON = 'Gallon',
    METER = 'Meter',
    SET = 'Set',
    PAIR = 'Pair',
}

export interface Product {
    id: number;
    name: string;
    category: string;
    packagingUnit?: string;
    unitsPerPackage?: number;
    brand?: string;
    model?: string;
    partType?: string;
    wholesalePrice: number;
    retailPrice: number;
    costPrice: number;
    quantity: number;
    lowStockThreshold: number;
    supplier?: string;
    storageLocation?: string;
    notes?: string;
    dateRecorded?: string;
    updatedAt?: string;
}

export interface StockMovement {
    id: number;
    product: Product;
    type: 'IN' | 'OUT' | 'LEND' | 'RETURN';
    quantity: number;
    purchasePrice?: number;
    supplier?: string;
    notes?: string;
    date: string;
}

export interface Sale {
    id: number;
    product: Product;
    quantitySold: number;
    saleType: 'WHOLESALE' | 'RETAIL';
    priceUsed: number;
    totalValue: number;
    customerType: string;
    notes?: string;
    date: string;
}

export interface Purchase {
    id: number;
    product: Product;
    productId: number;
    quantityPurchased: number;
    pricePerUnit: number;
    supplier?: string;
    notes?: string;
    totalValue: number;
    purchaseDate: string;
    recordedDate: string;
    date: string;
}

export interface Lending {
    id: number;
    product: Product;
    borrowerShop: string;
    quantityLent: number;
    quantityReturned: number;
    status: 'PENDING' | 'PARTIALLY_RETURNED' | 'RETURNED';
    dateLent: string;
    expectedReturnDate?: string;
    notes?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
