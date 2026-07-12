// Logistics-specific enums (re-exported from index for convenience)
export { 
    LogisticsItemCategory,
    StockStatus,
    ReturnReason,
    ItemCondition,
    ReturnStatus,
    ProductCategory, // Backward compatibility
} from './index';

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
    UNIT = 'Unit',
    ROLL = 'Roll',
}

// Logistics Item (formerly Product)
export interface LogisticsItem {
    id: number;
    name: string;
    category: string;
    packagingUnit?: string;
    unitsPerPackage?: number;
    brand?: string;
    model?: string;
    itemType?: string;  // Renamed from partType
    standardUnitCost: number;  // Renamed from wholesalePrice
    issueValue: number;  // Renamed from retailPrice
    costPrice: number;
    quantity: number;
    lowStockThreshold: number;
    supplier?: string;
    warehouse?: string;  // Renamed from storageLocation
    notes?: string;
    dateRecorded?: string;
    updatedAt?: string;
    stockStatus?: string;  // Computed by backend
    
    // Backward compatibility - old field names may still be present
    partType?: string;
    wholesalePrice?: number;
    retailPrice?: number;
    storageLocation?: string;
}

// Alias for backward compatibility
export type Product = LogisticsItem;

// Stock Movement
export interface StockMovement {
    id: number;
    product: LogisticsItem;
    type: 'IN' | 'OUT' | 'LEND' | 'RETURN';
    quantity: number;
    purchasePrice?: number;
    supplier?: string;
    notes?: string;
    date: string;
    createdAt?: string;
}

// Items Issued (formerly Sale)
export interface ItemIssued {
    id: number;
    product: LogisticsItem;
    productId: number;
    quantityIssued: number;  // Renamed from quantitySold
    priceUsed: number;  // For accounting/valuation
    totalValue: number;
    issuedTo?: string;  // Renamed from customerName
    department?: string;  // NEW: which department
    securitySite?: string;  // NEW: which site/branch
    issuedBy?: string;  // NEW: staff who issued
    approvedBy?: string;  // NEW: approval
    purpose?: string;  // NEW: reason for issue
    notes?: string;
    issueDate: string;  // Renamed from saleDate
    recordedDate: string;
    date: string;  // Backward compatibility
    
    // Backward compatibility - old field names may still be present
    quantitySold?: number;
    customerName?: string;
    saleDate?: string;
}

// Alias for backward compatibility
export type Sale = ItemIssued;

// Items Received (formerly Purchase)
export interface ItemReceived {
    id: number;
    product: LogisticsItem;
    productId: number;
    quantityReceived: number;  // Renamed from quantityPurchased
    pricePerUnit: number;
    supplier?: string;
    deliveryReference?: string;  // NEW: tracking number
    warehouse?: string;  // NEW: storage location
    receivedBy?: string;  // NEW: staff who received
    notes?: string;
    totalValue: number;
    receivingDate: string;  // Renamed from purchaseDate
    recordedDate: string;
    date: string;  // Backward compatibility
    
    // Backward compatibility - old field names may still be present
    quantityPurchased?: number;
    purchaseDate?: string;
}

// Alias for backward compatibility
export type Purchase = ItemReceived;

// Item Return (formerly Lending)
export interface ItemReturn {
    id: number;
    product: LogisticsItem;
    productId: number;
    quantityReturned: number;  // Renamed from quantityLent
    returnReference?: string;  // NEW: tracking number
    returnedBy: string;  // Renamed from borrowerShop
    department?: string;  // NEW
    securitySite?: string;  // NEW
    contactInfo?: string;  // Renamed from borrowerContact
    originalIssueReference?: string;  // NEW: link to original issue
    returnReason: string;  // NEW
    itemCondition: string;  // NEW
    status: string;  // NEW: ReturnStatus
    returnDate: string;  // Renamed from dateLent
    receivedBy?: string;  // NEW: staff who received return
    inspectedBy?: string;  // NEW
    inspectionDate?: string;  // NEW
    replacementIssueId?: number;  // NEW: link to replacement
    replacementIssued: boolean;  // NEW
    returnDocument?: string;  // NEW: uploaded document path
    notes?: string;
    createdAt?: string;
    
    // Backward compatibility - old lending fields may still be present
    quantityLent?: number;
    borrowerShop?: string;
    borrowerContact?: string;
    dateLent?: string;
    expectedReturnDate?: string;
}

// Alias for backward compatibility
export type Lending = ItemReturn;

// Paginated Response
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
}

// API Response wrappers
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// Dashboard statistics
export interface DashboardStats {
    totalLogisticsItems?: number;
    totalCategories?: number;
    totalItemsReceived?: number;
    totalItemsIssued?: number;
    currentInventoryValue?: number;
    lowStockItems?: number;
    outOfStockItems?: number;
    pendingInspection?: number;
    itemsUnderRepair?: number;
    damagedItems?: number;
    
    // Backward compatibility
    totalProducts?: number;
    totalPurchases?: number;
    totalSales?: number;
    valueOfSales?: number;
    valueOfPurchases?: number;
    stockBalance?: number;
    totalItemsInStock?: number;
    lentProducts?: number;
    productsLentOut?: number;
    lowStockCount?: number;
    revenueThisMonth?: number;
    itemsInStock?: number;
}

// Filter types
export interface LogisticsItemFilter {
    search?: string;
    category?: string;
    brand?: string;
    model?: string;
    supplier?: string;
    warehouse?: string;
    lowStock?: boolean;
    recentlyAdded?: boolean;
    page?: number;
    limit?: number;
}

export interface ItemReceivedFilter {
    from?: string;
    to?: string;
    supplier?: string;
    warehouse?: string;
    deliveryReference?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface ItemIssuedFilter {
    from?: string;
    to?: string;
    department?: string;
    securitySite?: string;
    issuedTo?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface ItemReturnFilter {
    status?: string;
    returnReason?: string;
    itemCondition?: string;
    department?: string;
    securitySite?: string;
    search?: string;
    page?: number;
    limit?: number;
}

// Create/Update DTOs
export interface CreateLogisticsItemDto {
    name: string;
    category: string;
    packagingUnit?: string;
    unitsPerPackage?: number;
    brand?: string;
    model?: string;
    itemType?: string;
    standardUnitCost: number;
    issueValue: number;
    costPrice: number;
    quantity: number;
    lowStockThreshold?: number;
    supplier?: string;
    warehouse?: string;
    notes?: string;
}

export interface CreateItemReceivedDto {
    productId: number;
    quantityReceived: number;
    pricePerUnit: number;
    supplier?: string;
    deliveryReference?: string;
    warehouse?: string;
    receivedBy?: string;
    receivingDate?: string;
    notes?: string;
}

export interface CreateItemIssuedDto {
    productId: number;
    quantityIssued: number;
    priceUsed: number;
    issuedTo?: string;
    department?: string;
    securitySite?: string;
    issuedBy?: string;
    approvedBy?: string;
    purpose?: string;
    issueDate?: string;
    notes?: string;
}

export interface CreateItemReturnDto {
    productId: number;
    quantityReturned: number;
    returnReference?: string;
    returnedBy: string;
    department?: string;
    securitySite?: string;
    contactInfo?: string;
    originalIssueReference?: string;
    returnReason: string;
    itemCondition?: string;
    returnDate?: string;
    receivedBy?: string;
    notes?: string;
}

export interface InspectReturnDto {
    itemCondition: string;
    inspectedBy?: string;
    inspectionDate?: string;
    notes?: string;
}

export interface IssueReplacementDto {
    issuedBy?: string;
    approvedBy?: string;
    notes?: string;
}
