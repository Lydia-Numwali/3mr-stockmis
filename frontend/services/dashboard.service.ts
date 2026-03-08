import { UtilsService } from './utils.service';

export class DashboardService {
    constructor(private utils: UtilsService) { }

    async getStats() {
        return this.utils.authorizedAPI().get('/dashboard/stats').then((res: any) => res.data);
    }

    async getSalesChart(period: 'week' | 'month' | 'year' = 'month') {
        return this.utils.authorizedAPI().get('/dashboard/revenue-trend', { params: { period } }).then((res: any) => res.data);
    }

    async getCategoryBreakdown() {
        return this.utils.authorizedAPI().get('/dashboard/category-breakdown').then((res: any) => res.data);
    }

    async getLowStockAlerts() {
        return this.utils.authorizedAPI().get('/dashboard/low-stock').then((res: any) => res.data);
    }
}
