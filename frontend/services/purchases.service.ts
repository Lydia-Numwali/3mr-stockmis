import { UtilsService } from './utils.service';
import { 
    ItemReceived, 
    CreateItemReceivedDto,
    ItemReceivedFilter,
    PaginatedResponse 
} from '@/types/stock';

// Backward compatibility - accept both old and new field names
export interface CreatePurchaseDto {
    productId: number;
    quantityReceived: number;  // NEW: renamed from quantityPurchased
    quantityPurchased?: number;  // OLD: for backward compatibility
    pricePerUnit?: number;  // Optional since prices are optional in the system
    supplier?: string;
    deliveryReference?: string;  // NEW: tracking number
    warehouse?: string;  // NEW: storage location
    receivedBy?: string;  // NEW: staff who received
    receivingDate?: string;  // NEW: renamed from purchaseDate
    purchaseDate?: string;  // OLD: for backward compatibility
    notes?: string;
}

export interface BulkPurchaseItemDto {
    productId: number;
    quantityReceived: number;  // NEW
    quantityPurchased?: number;  // OLD: for backward compatibility
    pricePerUnit?: number;  // Optional since prices are optional in the system
}

export interface CreateBulkPurchaseDto {
    supplier?: string;
    deliveryReference?: string;  // NEW
    warehouse?: string;  // NEW
    receivedBy?: string;  // NEW
    receivingDate?: string;  // NEW
    purchaseDate?: string;  // OLD: for backward compatibility
    notes?: string;
    items: BulkPurchaseItemDto[];
}

/**
 * Items Received Service (formerly Purchases Service)
 * Manages incoming inventory transactions
 */
export class PurchasesService {
    constructor(private utils: UtilsService) { }

    /**
     * Get all items received with filtering and pagination
     */
    async getPurchases(params: ItemReceivedFilter = {}): Promise<PaginatedResponse<ItemReceived>> {
        return this.utils.authorizedAPI().get('/purchases', { params }).then((res: any) => res.data);
    }

    /**
     * Get items received by supplier
     */
    async getBySupplier(supplier: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReceived>> {
        return this.utils.authorizedAPI().get('/purchases/by-supplier', { 
            params: { supplier, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get items received by warehouse
     */
    async getByWarehouse(warehouse: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReceived>> {
        return this.utils.authorizedAPI().get('/purchases/by-warehouse', { 
            params: { warehouse, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get receiving summary statistics
     */
    async getSummary(params: { from?: string; to?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/purchases/summary', { params }).then((res: any) => res.data);
    }

    /**
     * Record a new items received transaction
     */
    async create(data: CreateItemReceivedDto): Promise<ItemReceived> {
        // Ensure new field names are used
        const payload = {
            ...data,
            quantityReceived: data.quantityReceived ?? data.quantityPurchased,
            receivingDate: data.receivingDate || data.purchaseDate,
        };
        return this.utils.authorizedAPI().post('/purchases', payload).then((res: any) => res.data);
    }

    /**
     * Record multiple items received in one transaction
     */
    async createBulk(data: CreateBulkPurchaseDto): Promise<ItemReceived[]> {
        // Ensure new field names are used for all items
        const payload = {
            ...data,
            receivingDate: data.receivingDate || data.purchaseDate,
            items: data.items.map(item => ({
                ...item,
                quantityReceived: item.quantityReceived ?? item.quantityPurchased,
            })),
        };
        return this.utils.authorizedAPI().post('/purchases/bulk', payload).then((res: any) => res.data);
    }

    /**
     * Update an items received record
     */
    async update(id: number, data: Partial<CreateItemReceivedDto>): Promise<ItemReceived> {
        const payload = {
            ...data,
            quantityReceived: data.quantityReceived ?? data.quantityPurchased,
            receivingDate: data.receivingDate || data.purchaseDate,
        };
        return this.utils.authorizedAPI().put(`/purchases/${id}`, payload).then((res: any) => res.data);
    }

    /**
     * Delete an items received record
     */
    async delete(id: number): Promise<void> {
        return this.utils.authorizedAPI().delete(`/purchases/${id}`).then((res: any) => res.data);
    }
}

// Alias for backward compatibility
export const ItemsReceivedService = PurchasesService;