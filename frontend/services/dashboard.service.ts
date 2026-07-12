import { UtilsService } from './utils.service';
import { DashboardStats } from '@/types/stock';

/**
 * Dashboard Service
 * Provides statistics and metrics for the logistics management system
 */
export class DashboardService {
    constructor(private utils: UtilsService) { }

    /**
     * Get overall dashboard statistics
     * Returns logistics-focused metrics
     */
    async getStats(): Promise<DashboardStats> {
        return this.utils.authorizedAPI().get('/dashboard/stats').then((res: any) => res.data);
    }

    /**
     * Get items issued trend chart data
     * @param period - Time period for the chart (week, month, year)
     */
    async getSalesChart(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/revenue-trend', { 
            params: { period } 
        }).then((res: any) => res.data);
    }

    /**
     * Get items issued trend (alias for getSalesChart)
     */
    async getIssueTrend(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
        return this.getSalesChart(period);
    }

    /**
     * Get logistics item category breakdown
     */
    async getCategoryBreakdown(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/category-breakdown').then((res: any) => res.data);
    }

    /**
     * Get low stock alerts
     */
    async getLowStockAlerts(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/low-stock').then((res: any) => res.data);
    }

    /**
     * Get out of stock items
     */
    async getOutOfStockItems(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/out-of-stock').then((res: any) => res.data);
    }

    /**
     * Get recent receiving activity
     */
    async getRecentReceiving(params: { limit?: number } = { limit: 10 }): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/recent-receiving', { 
            params 
        }).then((res: any) => res.data);
    }

    /**
     * Get recent issue activity
     */
    async getRecentIssues(params: { limit?: number } = { limit: 10 }): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/recent-issues', { 
            params 
        }).then((res: any) => res.data);
    }

    /**
     * Get items pending inspection
     */
    async getPendingInspection(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/pending-inspection').then((res: any) => res.data);
    }

    /**
     * Get items under repair
     */
    async getItemsUnderRepair(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/under-repair').then((res: any) => res.data);
    }

    /**
     * Get damaged items count
     */
    async getDamagedItems(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/damaged-items').then((res: any) => res.data);
    }

    /**
     * Get inventory by warehouse
     */
    async getInventoryByWarehouse(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/inventory-by-warehouse').then((res: any) => res.data);
    }

    /**
     * Get department-wise issue statistics
     */
    async getDepartmentStats(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/department-stats').then((res: any) => res.data);
    }

    /**
     * Get security site-wise issue statistics
     */
    async getSiteStats(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/site-stats').then((res: any) => res.data);
    }

    /**
     * Get top issued items
     */
    async getTopIssuedItems(params: { limit?: number } = { limit: 10 }): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/top-issued', { 
            params 
        }).then((res: any) => res.data);
    }

    /**
     * Get inventory value statistics
     */
    async getInventoryValue(): Promise<any> {
        return this.utils.authorizedAPI().get('/dashboard/inventory-value').then((res: any) => res.data);
    }
}

// No alias needed - service name matches new terminology
