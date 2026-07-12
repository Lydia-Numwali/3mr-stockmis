import { UtilsService } from './utils.service';
import { 
    ItemIssued, 
    CreateItemIssuedDto,
    ItemIssuedFilter,
    PaginatedResponse 
} from '@/types/stock';

// Backward compatibility - accept both old and new field names
export interface CreateSaleDto {
    productId: number;
    quantityIssued: number;  // NEW: renamed from quantitySold
    quantitySold?: number;  // OLD: for backward compatibility
    priceUsed?: number;  // Optional - for accounting/valuation purposes
    issuedTo?: string;  // NEW: renamed from customerName
    customerName?: string;  // OLD: for backward compatibility
    department?: string;  // NEW: which department
    securitySite?: string;  // NEW: which site/branch
    issuedBy?: string;  // NEW: staff who issued
    approvedBy?: string;  // NEW: approval
    purpose?: string;  // NEW: reason for issue
    issueDate?: string;  // NEW: renamed from saleDate
    saleDate?: string;  // OLD: for backward compatibility
    notes?: string;
    // REMOVED: saleType, paymentStatus, amountPaid, dueDate (not applicable for internal logistics)
}

export interface BulkSaleItemDto {
    productId: number;
    quantityIssued: number;  // NEW
    quantitySold?: number;  // OLD: for backward compatibility
    priceUsed?: number;  // Optional - for accounting/valuation purposes
}

export interface CreateBulkSaleDto {
    issuedTo?: string;  // NEW
    customerName?: string;  // OLD: for backward compatibility
    department?: string;  // NEW
    securitySite?: string;  // NEW
    issuedBy?: string;  // NEW
    approvedBy?: string;  // NEW
    purpose?: string;  // NEW
    issueDate?: string;  // NEW
    saleDate?: string;  // OLD: for backward compatibility
    notes?: string;
    items: BulkSaleItemDto[];
}

/**
 * Items Issued Service (formerly Sales Service)
 * Manages outgoing inventory transactions (internal distribution)
 */
export class SalesService {
    constructor(private utils: UtilsService) { }

    /**
     * Get all items issued with filtering and pagination
     */
    async getSales(params: ItemIssuedFilter = {}): Promise<PaginatedResponse<ItemIssued>> {
        return this.utils.authorizedAPI().get('/sales', { params }).then((res: any) => res.data);
    }

    /**
     * Get items issued by department
     */
    async getByDepartment(department: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemIssued>> {
        return this.utils.authorizedAPI().get('/sales/by-department', { 
            params: { department, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get items issued by security site
     */
    async getBySite(securitySite: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemIssued>> {
        return this.utils.authorizedAPI().get('/sales/by-site', { 
            params: { securitySite, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get items issued to a specific person
     */
    async getByRecipient(issuedTo: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemIssued>> {
        return this.utils.authorizedAPI().get('/sales/by-recipient', { 
            params: { issuedTo, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get issue summary statistics
     */
    async getSummary(params: { from?: string; to?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/sales/summary', { params }).then((res: any) => res.data);
    }

    /**
     * Issue items to employee/department/site
     */
    async create(data: CreateItemIssuedDto): Promise<ItemIssued> {
        // Ensure new field names are used
        const payload = {
            ...data,
            quantityIssued: data.quantityIssued ?? data.quantitySold,
            issuedTo: data.issuedTo || data.customerName,
            issueDate: data.issueDate || data.saleDate,
        };
        return this.utils.authorizedAPI().post('/sales', payload).then((res: any) => res.data);
    }

    /**
     * Issue multiple items in one transaction
     */
    async createBulk(data: CreateBulkSaleDto): Promise<ItemIssued[]> {
        // Ensure new field names are used for all items
        const payload = {
            ...data,
            issuedTo: data.issuedTo || data.customerName,
            issueDate: data.issueDate || data.saleDate,
            items: data.items.map(item => ({
                ...item,
                quantityIssued: item.quantityIssued ?? item.quantitySold,
            })),
        };
        return this.utils.authorizedAPI().post('/sales/bulk', payload).then((res: any) => res.data);
    }

    /**
     * Update an items issued record
     */
    async update(id: number, data: Partial<CreateItemIssuedDto>): Promise<ItemIssued> {
        const payload = {
            ...data,
            quantityIssued: data.quantityIssued ?? data.quantitySold,
            issuedTo: data.issuedTo || data.customerName,
            issueDate: data.issueDate || data.saleDate,
        };
        return this.utils.authorizedAPI().put(`/sales/${id}`, payload).then((res: any) => res.data);
    }

    /**
     * Delete an items issued record
     */
    async delete(id: number): Promise<void> {
        return this.utils.authorizedAPI().delete(`/sales/${id}`).then((res: any) => res.data);
    }
}

// Alias for backward compatibility
export const ItemsIssuedService = SalesService;
