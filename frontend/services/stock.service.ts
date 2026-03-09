import { UtilsService } from './utils.service';

export interface AddStockDto {
    productId: number;
    quantity: number;
    purchasePrice: number;
    supplier?: string;
    notes?: string;
}

export class StockService {
    constructor(private utils: UtilsService) { }

    async getMovements(params: { page?: number; limit?: number; search?: string } = {}) {
        return this.utils.authorizedAPI().get('/stock/movements', { params }).then((res: any) => res.data);
    }

    async addStock(data: AddStockDto) {
        return this.utils.authorizedAPI().post('/stock/add', data).then((res: any) => res.data);
    }
}
