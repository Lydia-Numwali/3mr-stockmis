import { UtilsService } from './utils.service';
import { 
    LogisticsItem, 
    CreateLogisticsItemDto,
    LogisticsItemFilter,
    PaginatedResponse 
} from '@/types/stock';

// Backward compatibility - accept both old and new field names
export interface CreateProductDto {
    name: string;
    category?: string;
    packagingUnit?: string;
    unitsPerPackage?: number;
    brand?: string;
    model?: string;
    itemType?: string;  // NEW: renamed from partType
    partType?: string;  // OLD: for backward compatibility
    standardUnitCost: number;  // NEW: renamed from wholesalePrice
    wholesalePrice?: number;  // OLD: for backward compatibility
    issueValue: number;  // NEW: renamed from retailPrice
    retailPrice?: number;  // OLD: for backward compatibility
    costPrice: number;
    quantity: number;
    lowStockThreshold: number;
    supplier?: string;
    warehouse?: string;  // NEW: renamed from storageLocation
    storageLocation?: string;  // OLD: for backward compatibility
    notes?: string;
}

/**
 * Logistics Items Service (formerly Products Service)
 * Manages all logistics items/assets in the system
 */
export class ProductsService {
    constructor(private utils: UtilsService) { }

    /**
     * Get all logistics items with filtering and pagination
     */
    async findAll(params: LogisticsItemFilter = {}): Promise<PaginatedResponse<LogisticsItem>> {
        return this.utils.authorizedAPI().get('/products', { params }).then((res: any) => res.data);
    }

    /**
     * Get a single logistics item by ID
     */
    async findOne(id: number): Promise<LogisticsItem> {
        return this.utils.authorizedAPI().get(`/products/${id}`).then((res: any) => res.data);
    }

    /**
     * Get most frequently issued items
     */
    async getBestSelling(): Promise<LogisticsItem[]> {
        return this.utils.authorizedAPI().get('/products/best-selling').then((res: any) => res.data);
    }

    /**
     * Get items by category
     */
    async getByCategory(category: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<LogisticsItem>> {
        return this.utils.authorizedAPI().get('/products/by-category', { 
            params: { category, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get items by warehouse
     */
    async getByWarehouse(warehouse: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<LogisticsItem>> {
        return this.utils.authorizedAPI().get('/products/by-warehouse', { 
            params: { warehouse, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get low stock items
     */
    async getLowStock(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<LogisticsItem>> {
        return this.utils.authorizedAPI().get('/products/low-stock', { params }).then((res: any) => res.data);
    }

    /**
     * Get out of stock items
     */
    async getOutOfStock(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<LogisticsItem>> {
        return this.utils.authorizedAPI().get('/products/out-of-stock', { params }).then((res: any) => res.data);
    }

    /**
     * Create a new logistics item
     */
    async create(data: CreateLogisticsItemDto): Promise<LogisticsItem> {
        // Ensure new field names are used
        const payload = {
            ...data,
            itemType: data.itemType || data.partType,
            standardUnitCost: data.standardUnitCost ?? data.wholesalePrice,
            issueValue: data.issueValue ?? data.retailPrice,
            warehouse: data.warehouse || data.storageLocation,
        };
        return this.utils.authorizedAPI().post('/products', payload).then((res: any) => res.data);
    }

    /**
     * Update an existing logistics item
     */
    async update(id: number, data: Partial<CreateLogisticsItemDto>): Promise<LogisticsItem> {
        // Ensure new field names are used
        const payload = {
            ...data,
            itemType: data.itemType || data.partType,
            standardUnitCost: data.standardUnitCost ?? data.wholesalePrice,
            issueValue: data.issueValue ?? data.retailPrice,
            warehouse: data.warehouse || data.storageLocation,
        };
        return this.utils.authorizedAPI().put(`/products/${id}`, payload).then((res: any) => res.data);
    }

    /**
     * Delete a logistics item
     */
    async delete(id: number): Promise<void> {
        return this.utils.authorizedAPI().delete(`/products/${id}`).then((res: any) => res.data);
    }
}

// Alias for backward compatibility
export const LogisticsItemsService = ProductsService;
