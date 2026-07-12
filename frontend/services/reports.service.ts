import { UtilsService } from './utils.service';

/**
 * Reports Service
 * Generates various logistics reports for the system
 */
export class ReportsService {
    constructor(private utils: UtilsService) { }

    /**
     * Get income report (legacy - now focuses on internal accounting)
     * @deprecated Consider using getInventoryValueReport instead
     */
    async getIncomeReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/income', { params }).then((res: any) => res.data);
    }

    /**
     * Get items issued report (formerly sales report)
     */
    async getSalesReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/sales', { params }).then((res: any) => res.data);
    }

    /**
     * Get items issued report (alias with new terminology)
     */
    async getItemsIssuedReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.getSalesReport(params);
    }

    /**
     * Get current stock report
     */
    async getStockReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/stock', { params }).then((res: any) => res.data);
    }

    /**
     * Get current logistics inventory report (alias)
     */
    async getInventoryReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.getStockReport(params);
    }

    /**
     * Get items received report (formerly purchase report)
     */
    async getPurchasesReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/purchases', { params }).then((res: any) => res.data);
    }

    /**
     * Get items received report (alias with new terminology)
     */
    async getItemsReceivedReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.getPurchasesReport(params);
    }

    /**
     * Get returns report (formerly lending report)
     */
    async getLendingReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/lending', { params }).then((res: any) => res.data);
    }

    /**
     * Get item returns report (alias with new terminology)
     */
    async getReturnsReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.getLendingReport(params);
    }

    /**
     * Get inventory movement report
     */
    async getInventoryMovementReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/inventory-movement', { params }).then((res: any) => res.data);
    }

    /**
     * Get low stock report
     */
    async getLowStockReport(): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/low-stock').then((res: any) => res.data);
    }

    /**
     * Get supplier report
     */
    async getSupplierReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/supplier', { params }).then((res: any) => res.data);
    }

    /**
     * Get employee issue report (who received what)
     */
    async getEmployeeIssueReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/employee-issue', { params }).then((res: any) => res.data);
    }

    /**
     * Get category summary report
     */
    async getCategoryReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/category', { params }).then((res: any) => res.data);
    }

    /**
     * Get returned items report
     */
    async getReturnedItemsReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/returned-items', { params }).then((res: any) => res.data);
    }

    /**
     * Get damaged items report
     */
    async getDamagedItemsReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/damaged-items', { params }).then((res: any) => res.data);
    }

    /**
     * Get repair & maintenance report
     */
    async getRepairMaintenanceReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/repair-maintenance', { params }).then((res: any) => res.data);
    }

    /**
     * Get replacement history report
     */
    async getReplacementHistoryReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/replacement-history', { params }).then((res: any) => res.data);
    }

    /**
     * Get disposal report
     */
    async getDisposalReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/disposal', { params }).then((res: any) => res.data);
    }

    /**
     * Get department-wise issue report
     */
    async getDepartmentReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/department', { params }).then((res: any) => res.data);
    }

    /**
     * Get security site-wise issue report
     */
    async getSiteReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/site', { params }).then((res: any) => res.data);
    }

    /**
     * Get warehouse inventory report
     */
    async getWarehouseReport(params: { startDate?: string; endDate?: string } = {}): Promise<any> {
        return this.utils.authorizedAPI().get('/reports/warehouse', { params }).then((res: any) => res.data);
    }

    /**
     * Export items issued report (formerly sales export)
     */
    async exportSales(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.utils.authorizedAPI().get('/reports/export/sales', { 
            params, 
            responseType: 'blob' 
        }).then((res: any) => res.data);
    }

    /**
     * Export items issued report (alias)
     */
    async exportItemsIssued(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.exportSales(params);
    }

    /**
     * Export stock report
     */
    async exportStock(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.utils.authorizedAPI().get('/reports/export/stock', { 
            params, 
            responseType: 'blob' 
        }).then((res: any) => res.data);
    }

    /**
     * Export inventory report (alias)
     */
    async exportInventory(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.exportStock(params);
    }

    /**
     * Export items received report
     */
    async exportPurchases(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.utils.authorizedAPI().get('/reports/export/purchases', { 
            params, 
            responseType: 'blob' 
        }).then((res: any) => res.data);
    }

    /**
     * Export items received report (alias)
     */
    async exportItemsReceived(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.exportPurchases(params);
    }

    /**
     * Export returns report (formerly lending export)
     */
    async exportLending(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.utils.authorizedAPI().get('/reports/export/lending', { 
            params, 
            responseType: 'blob' 
        }).then((res: any) => res.data);
    }

    /**
     * Export returns report (alias)
     */
    async exportReturns(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.exportLending(params);
    }

    /**
     * Export low stock report
     */
    async exportLowStock(): Promise<Blob> {
        return this.utils.authorizedAPI().get('/reports/export/low-stock', { 
            responseType: 'blob' 
        }).then((res: any) => res.data);
    }

    /**
     * Export category report
     */
    async exportCategory(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.utils.authorizedAPI().get('/reports/export/category', { 
            params, 
            responseType: 'blob' 
        }).then((res: any) => res.data);
    }

    /**
     * Export supplier report
     */
    async exportSupplier(params: { startDate?: string; endDate?: string } = {}): Promise<Blob> {
        return this.utils.authorizedAPI().get('/reports/export/supplier', { 
            params, 
            responseType: 'blob' 
        }).then((res: any) => res.data);
    }
}

// No alias needed - service name matches new terminology
