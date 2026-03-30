import { UtilsService } from './utils.service';

export interface CreatePurchaseDto {
    productId: number;
    quantityPurchased: number;
    pricePerUnit: number;
    supplier?: string;
    purchaseDate?: string;
    notes?: string;
}

export interface BulkPurchaseItemDto {
    productId: number;
    quantityPurchased: number;
    pricePerUnit: number;
}

export interface CreateBulkPurchaseDto {
    supplier?: string;
    purchaseDate?: string;
    notes?: string;
    items: BulkPurchaseItemDto[];
}

export class PurchasesService {
    constructor(private utils: UtilsService) { }

    async getPurchases(params: { 
        page?: number; 
        limit?: number; 
        from?: string; 
        to?: string; 
        supplier?: string;
        search?: string;
    } = {}) {
        return this.utils.authorizedAPI().get('/purchases', { params }).then((res: any) => res.data);
    }

    async create(data: CreatePurchaseDto) {
        return this.utils.authorizedAPI().post('/purchases', data).then((res: any) => res.data);
    }

    async createBulk(data: CreateBulkPurchaseDto) {
        return this.utils.authorizedAPI().post('/purchases/bulk', data).then((res: any) => res.data);
    }
}