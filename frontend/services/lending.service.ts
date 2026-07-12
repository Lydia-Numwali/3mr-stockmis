import { UtilsService } from './utils.service';
import { 
    ItemReturn, 
    CreateItemReturnDto,
    InspectReturnDto,
    IssueReplacementDto,
    ItemReturnFilter,
    PaginatedResponse,
    ItemIssued 
} from '@/types/stock';

// Backward compatibility - accept both old and new field names
export interface CreateLendingDto {
    productId: number;
    quantityLent?: number;  // Optional: for lending
    quantityReturned?: number;  // Optional: for returns
    returnReference?: string;  // NEW: tracking number
    returnedBy?: string;  // Optional: for returns
    borrowerShop?: string;  // For lending
    department?: string;  // NEW
    securitySite?: string;  // NEW
    contactInfo?: string;  // NEW
    borrowerContact?: string;  // OLD: for backward compatibility
    originalIssueReference?: string;  // NEW
    returnReason?: string;  // Optional: for returns
    itemCondition?: string;  // NEW
    returnDate?: string;  // Optional: for returns
    dateLent?: string;  // OLD: for backward compatibility
    expectedReturnDate?: string;  // For lending
    receivedBy?: string;  // NEW
    notes?: string;
}

export interface ReturnLendingDto {
    quantityReturned: number;
    notes?: string;
}

/**
 * Item Returns Service (formerly Lending Service)
 * Manages returned items workflow including inspection and replacement
 */
export class LendingService {
    constructor(private utils: UtilsService) { }

    /**
     * Get all item returns with filtering and pagination
     */
    async findAll(params: ItemReturnFilter = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending', { params }).then((res: any) => res.data);
    }

    /**
     * Get returns by status
     */
    async getByStatus(status: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending/by-status', { 
            params: { status, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get returns by condition
     */
    async getByCondition(condition: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending/by-condition', { 
            params: { condition, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get returns by department
     */
    async getByDepartment(department: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending/by-department', { 
            params: { department, ...params } 
        }).then((res: any) => res.data);
    }

    /**
     * Get returns pending inspection
     */
    async getPendingInspection(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending/pending-inspection', { params }).then((res: any) => res.data);
    }

    /**
     * Get items under repair
     */
    async getUnderRepair(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending/under-repair', { params }).then((res: any) => res.data);
    }

    /**
     * Get damaged items
     */
    async getDamaged(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending/damaged', { params }).then((res: any) => res.data);
    }

    /**
     * Get items that were replaced
     */
    async getReplaced(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<ItemReturn>> {
        return this.utils.authorizedAPI().get('/lending/replaced', { params }).then((res: any) => res.data);
    }

    /**
     * Get return summary statistics
     */
    async getSummary(params: { from?: string; to?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/lending/summary', { params }).then((res: any) => res.data);
    }

    /**
     * Get overdue items (legacy endpoint - may not be applicable for returns)
     * @deprecated Use getPendingInspection() instead
     */
    async getOverdue(): Promise<ItemReturn[]> {
        return this.utils.authorizedAPI().get('/lending/overdue').then((res: any) => res.data);
    }

    /**
     * Record a new item return
     */
    async create(data: CreateItemReturnDto): Promise<ItemReturn> {
        // Ensure new field names are used
        const anyData = data as any; // Cast to handle backward compatibility fields
        const payload = {
            ...data,
            quantityReturned: data.quantityReturned ?? anyData.quantityLent,
            returnedBy: data.returnedBy || anyData.borrowerShop,
            contactInfo: data.contactInfo || anyData.borrowerContact,
            returnDate: data.returnDate || anyData.dateLent,
        };
        return this.utils.authorizedAPI().post('/lending', payload).then((res: any) => res.data);
    }

    /**
     * Inspect a returned item and update its condition
     */
    async inspectReturn(id: number, data: InspectReturnDto): Promise<ItemReturn> {
        return this.utils.authorizedAPI().post(`/lending/${id}/inspect`, data).then((res: any) => res.data);
    }

    /**
     * Issue a replacement item for a damaged/defective return
     */
    async issueReplacement(id: number, data: IssueReplacementDto): Promise<ItemIssued> {
        return this.utils.authorizedAPI().post(`/lending/${id}/replacement`, data).then((res: any) => res.data);
    }

    /**
     * Mark return as restocked (good condition items)
     */
    async restockReturn(id: number): Promise<ItemReturn> {
        return this.utils.authorizedAPI().post(`/lending/${id}/restock`).then((res: any) => res.data);
    }

    /**
     * Send item for repair
     */
    async sendForRepair(id: number, data: { notes?: string } = {}): Promise<ItemReturn> {
        return this.utils.authorizedAPI().post(`/lending/${id}/repair`, data).then((res: any) => res.data);
    }

    /**
     * Mark item as disposed (beyond repair)
     */
    async disposeItem(id: number, data: { notes?: string } = {}): Promise<ItemReturn> {
        return this.utils.authorizedAPI().post(`/lending/${id}/dispose`, data).then((res: any) => res.data);
    }

    /**
     * Legacy method for backward compatibility
     * @deprecated Use inspectReturn() or issueReplacement() instead
     */
    async returnLending(id: number, data: ReturnLendingDto): Promise<ItemReturn> {
        return this.utils.authorizedAPI().post(`/lending/${id}/return`, data).then((res: any) => res.data);
    }

    /**
     * Update a return record
     */
    async update(id: number, data: Partial<CreateItemReturnDto>): Promise<ItemReturn> {
        const anyData = data as any; // Cast to handle backward compatibility fields
        const payload = {
            ...data,
            quantityReturned: data.quantityReturned ?? anyData.quantityLent,
            returnedBy: data.returnedBy || anyData.borrowerShop,
            contactInfo: data.contactInfo || anyData.borrowerContact,
            returnDate: data.returnDate || anyData.dateLent,
        };
        return this.utils.authorizedAPI().put(`/lending/${id}`, payload).then((res: any) => res.data);
    }

    /**
     * Delete a return record
     */
    async delete(id: number): Promise<void> {
        return this.utils.authorizedAPI().delete(`/lending/${id}`).then((res: any) => res.data);
    }
}

// Alias for backward compatibility
export const ItemReturnsService = LendingService;
export const ReturnsService = LendingService;
