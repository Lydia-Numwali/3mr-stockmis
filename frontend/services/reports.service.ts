import { UtilsService } from './utils.service';

export class ReportsService {
    constructor(private utils: UtilsService) { }

    async getIncomeReport(params: { startDate?: string; endDate?: string } = {}) {
        return this.utils.authorizedAPI().get('/reports/income', { params }).then((res: any) => res.data);
    }

    async getSalesReport(params: { startDate?: string; endDate?: string } = {}) {
        return this.utils.authorizedAPI().get('/reports/sales', { params }).then((res: any) => res.data);
    }

    async getStockReport(params: { startDate?: string; endDate?: string } = {}) {
        return this.utils.authorizedAPI().get('/reports/stock', { params }).then((res: any) => res.data);
    }

    async getLendingReport(params: { startDate?: string; endDate?: string } = {}) {
        return this.utils.authorizedAPI().get('/reports/lending', { params }).then((res: any) => res.data);
    }

    async exportSales(params: { startDate?: string; endDate?: string } = {}) {
        return this.utils.authorizedAPI().get('/reports/export/sales', { params, responseType: 'blob' }).then((res: any) => res.data);
    }

    async exportStock(params: { startDate?: string; endDate?: string } = {}) {
        return this.utils.authorizedAPI().get('/reports/export/stock', { params, responseType: 'blob' }).then((res: any) => res.data);
    }

    async exportLending(params: { startDate?: string; endDate?: string } = {}) {
        return this.utils.authorizedAPI().get('/reports/export/lending', { params, responseType: 'blob' }).then((res: any) => res.data);
    }
}
