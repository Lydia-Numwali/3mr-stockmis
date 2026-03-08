import { UtilsService } from './utils.service';

export interface CreateProductDto {
    name: string;
    category?: string;
    brand?: string;
    model?: string;
    partType?: string;
    wholesalePrice: number;
    retailPrice: number;
    costPrice: number;
    quantity: number;
    lowStockThreshold: number;
    supplier?: string;
    storageLocation?: string;
}

export class ProductsService {
    constructor(private utils: UtilsService) { }

    async findAll(params: { page?: number; limit?: number; search?: string } = {}) {
        return this.utils.authorizedAPI().get('/products', { params }).then((res: any) => res.data);
    }

    async findOne(id: number) {
        return this.utils.authorizedAPI().get(`/products/${id}`).then((res: any) => res.data);
    }

    async getBestSelling() {
        return this.utils.authorizedAPI().get('/products/best-selling').then((res: any) => res.data);
    }

    async create(data: CreateProductDto) {
        return this.utils.authorizedAPI().post('/products', data).then((res: any) => res.data);
    }

    async update(id: number, data: Partial<CreateProductDto>) {
        return this.utils.authorizedAPI().put(`/products/${id}`, data).then((res: any) => res.data);
    }

    async delete(id: number) {
        return this.utils.authorizedAPI().delete(`/products/${id}`).then((res: any) => res.data);
    }
}
