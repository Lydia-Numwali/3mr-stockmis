import { UtilsService } from './utils.service';

export interface CreateSaleDto {
    productId: number;
    quantitySold: number;
    saleType: 'WHOLESALE' | 'RETAIL';
    priceUsed: number;
    customerType: string;
}

export class SalesService {
    constructor(private utils: UtilsService) { }

    async getSales(params: { page?: number; limit?: number; search?: string } = {}) {
        return this.utils.authorizedAPI().get('/sales', { params }).then((res: any) => res.data);
    }

    async create(data: CreateSaleDto) {
        return this.utils.authorizedAPI().post('/sales', data).then((res: any) => res.data);
    }
}
