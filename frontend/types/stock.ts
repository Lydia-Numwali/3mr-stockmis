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
    assetId?: string;
    name: string;
    category: string;
    packagingUnit?: string;
    unitsPerPackage?: number;
    brand?: string;
    model?: string;
    serialNumber?: string;
    itemType?: string;  // Renamed from partType
    standardUnitCost: number;  // Renamed from wholesalePrice
    issueValue: number;  // Renamed from retailPrice
    costPrice: number;
    quantity: number;
    lowStockThreshold: number;
    supplier?: string;
    location?: string;  // Renamed from warehouse — matches Excel "Location"
    custodian?: string;
    condition?: string;
    purchaseDate?: string;
    notes?: string;
    dateRecorded?: string;
    updatedAt?: string;
    stockStatus?: string;  // Computed by backend
    
    // Backward compatibility - old field names may still be present
    partType?: string;
    wholesalePrice?: number;
    retailPrice?: number;
    warehouse?: string;
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
    assetId?: string;
    serialNumber?: string;
    location?: string;
    custodian?: string;
    condition?: string;
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
    location?: string;  // Renamed from warehouse
    warehouse?: string;  // Backward compatibility
    assetId?: string;
    serialNumber?: string;
    custodian?: string;
    condition?: string;
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
    location?: string;
    warehouse?: string;  // Backward compatibility
    lowStock?: boolean;
    recentlyAdded?: boolean;
    page?: number;
    limit?: number;
}

export interface ItemReceivedFilter {
    from?: string;
    to?: string;
    supplier?: string;
    location?: string;
    warehouse?: string;  // Backward compatibility
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
    assetId?: string;
    name: string;
    category?: string;  // Optional to allow flexibility
    packagingUnit?: string;
    unitsPerPackage?: number;
    brand?: string;
    model?: string;
    serialNumber?: string;
    itemType?: string;
    standardUnitCost?: number;  // Optional since prices are optional
    issueValue?: number;  // Optional since prices are optional
    costPrice?: number;  // Optional since prices are optional
    quantity: number;
    lowStockThreshold?: number;
    supplier?: string;
    location?: string;
    custodian?: string;
    condition?: string;
    purchaseDate?: string;
    notes?: string;
    // Backward compatibility
    warehouse?: string;
    storageLocation?: string;
}

export interface CreateItemReceivedDto {
    // Option 1: Add to existing item
    productId?: number;
    
    // Option 2: Create new item
    itemName?: string;
    category?: string;
    brand?: string;
    model?: string;
    itemType?: string;
    
    // Common fields
    quantityReceived: number;
    pricePerUnit?: number;  // Optional since prices are optional in the system
    supplier?: string;
    deliveryReference?: string;
    location?: string;
    warehouse?: string;  // Backward compatibility
    serialNumber?: string;
    custodian?: string;
    condition?: string;
    receivedBy?: string;
    receivingDate?: string;
    notes?: string;
}

export interface CreateItemIssuedDto {
    productId: number;
    quantityIssued: number;
    priceUsed?: number;  // Optional since prices are optional in the system
    issuedTo?: string;
    department?: string;
    securitySite?: string;
    issuedBy?: string;
    approvedBy?: string;
    purpose?: string;
    assetId?: string;
    serialNumber?: string;
    location?: string;
    custodian?: string;
    condition?: string;
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
