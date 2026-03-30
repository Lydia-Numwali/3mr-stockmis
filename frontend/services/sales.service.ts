import { UtilsService } from './utils.service';

export interface CreateSaleDto {
    productId: number;
    quantitySold: number;
    saleType: 'WHOLESALE' | 'RETAIL';
    priceUsed: number;
    customerType: string;
}

export interface BulkSaleItemDto {
    productId: number;
    quantitySold: number;
    saleType: 'WHOLESALE' | 'RETAIL';
    priceUsed: number;
}

export interface CreateBulkSaleDto {
    customerName?: string;
    saleDate?: string;
    notes?: string;
    items: BulkSaleItemDto[];
}

export class SalesService {
    constructor(private utils: UtilsService) { }

    async getSales(params: { 
        page?: number; 
        limit?: number; 
        search?: string;
        from?: string;
        to?: string;
        saleType?: string;
        customerName?: string;
    } = {}) {
        return this.utils.authorizedAPI().get('/sales', { params }).then((res: any) => res.data);
    }

    async create(data: CreateSaleDto) {
        return this.utils.authorizedAPI().post('/sales', data).then((res: any) => res.data);
    }

    async createBulk(data: CreateBulkSaleDto) {
        return this.utils.authorizedAPI().post('/sales/bulk', data).then((res: any) => res.data);
    }
}
