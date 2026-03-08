import { UtilsService } from './utils.service';

export interface CreateLendingDto {
    productId: number;
    borrowerShop: string;
    quantityLent: number;
    expectedReturnDate?: string;
    notes?: string;
}

export interface ReturnLendingDto {
    quantityReturned: number;
    notes?: string;
}

export class LendingService {
    constructor(private utils: UtilsService) { }

    async findAll(params: { page?: number; limit?: number; search?: string } = {}) {
        return this.utils.authorizedAPI().get('/lending', { params }).then((res: any) => res.data);
    }

    async getOverdue() {
        return this.utils.authorizedAPI().get('/lending/overdue').then((res: any) => res.data);
    }

    async create(data: CreateLendingDto) {
        return this.utils.authorizedAPI().post('/lending', data).then((res: any) => res.data);
    }

    async returnLending(id: number, data: ReturnLendingDto) {
        return this.utils.authorizedAPI().post(`/lending/${id}/return`, data).then((res: any) => res.data);
    }
}
