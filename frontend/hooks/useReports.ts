import { useQuery, useMutation } from '@tanstack/react-query';
import { ReportsService } from '@/services/reports.service';
import { UtilsService } from '@/services/utils.service';
import { toast } from 'sonner';

const reportsService = new ReportsService(new UtilsService());

/**
 * Helper function to handle file downloads
 */
function handleBlobDownload(data: any, filename: string) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
}

// ============================================================================
// REPORT QUERIES
// ============================================================================

/**
 * Get income report (legacy - now focuses on internal accounting)
 * @deprecated Consider using useInventoryValueReport instead
 */
export function useIncomeReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'income', params],
        queryFn: () => reportsService.getIncomeReport(params),
    });
}

/**
 * Get items issued report
 */
export function useSalesReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'sales', params],
        queryFn: () => reportsService.getSalesReport(params),
    });
}

/**
 * Alias with new terminology
 */
export function useItemsIssuedReport(params?: { startDate?: string; endDate?: string }) {
    return useSalesReport(params);
}

/**
 * Get current stock report
 */
export function useStockReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'stock', params],
        queryFn: () => reportsService.getStockReport(params),
    });
}

/**
 * Alias with new terminology
 */
export function useInventoryReport(params?: { startDate?: string; endDate?: string }) {
    return useStockReport(params);
}

/**
 * Get items received report
 */
export function usePurchasesReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'purchases', params],
        queryFn: () => reportsService.getPurchasesReport(params),
    });
}

/**
 * Alias with new terminology
 */
export function useItemsReceivedReport(params?: { startDate?: string; endDate?: string }) {
    return usePurchasesReport(params);
}

/**
 * Get returns report
 */
export function useLendingReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'lending', params],
        queryFn: () => reportsService.getLendingReport(params),
    });
}

/**
 * Alias with new terminology
 */
export function useReturnsReport(params?: { startDate?: string; endDate?: string }) {
    return useLendingReport(params);
}

/**
 * Get inventory movement report
 */
export function useInventoryMovementReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'inventory-movement', params],
        queryFn: () => reportsService.getInventoryMovementReport(params),
    });
}

/**
 * Get low stock report
 */
export function useLowStockReport() {
    return useQuery({
        queryKey: ['reports', 'low-stock'],
        queryFn: () => reportsService.getLowStockReport(),
    });
}

/**
 * Get supplier report
 */
export function useSupplierReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'supplier', params],
        queryFn: () => reportsService.getSupplierReport(params),
    });
}

/**
 * Get employee issue report
 */
export function useEmployeeIssueReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'employee-issue', params],
        queryFn: () => reportsService.getEmployeeIssueReport(params),
    });
}

/**
 * Get category summary report
 */
export function useCategoryReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'category', params],
        queryFn: () => reportsService.getCategoryReport(params),
    });
}

/**
 * Get returned items report
 */
export function useReturnedItemsReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'returned-items', params],
        queryFn: () => reportsService.getReturnedItemsReport(params),
    });
}

/**
 * Get damaged items report
 */
export function useDamagedItemsReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'damaged-items', params],
        queryFn: () => reportsService.getDamagedItemsReport(params),
    });
}

/**
 * Get repair & maintenance report
 */
export function useRepairMaintenanceReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'repair-maintenance', params],
        queryFn: () => reportsService.getRepairMaintenanceReport(params),
    });
}

/**
 * Get replacement history report
 */
export function useReplacementHistoryReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'replacement-history', params],
        queryFn: () => reportsService.getReplacementHistoryReport(params),
    });
}

/**
 * Get disposal report
 */
export function useDisposalReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'disposal', params],
        queryFn: () => reportsService.getDisposalReport(params),
    });
}

/**
 * Get department-wise issue report
 */
export function useDepartmentReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'department', params],
        queryFn: () => reportsService.getDepartmentReport(params),
    });
}

/**
 * Get security site-wise issue report
 */
export function useSiteReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'site', params],
        queryFn: () => reportsService.getSiteReport(params),
    });
}

/**
 * Get warehouse inventory report
 */
export function useWarehouseReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'warehouse', params],
        queryFn: () => reportsService.getWarehouseReport(params),
    });
}

// ============================================================================
// EXPORT MUTATIONS
// ============================================================================

/**
 * Export items issued report
 */
export function useExportSales() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportSales(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `items_issued_report_${new Date().getTime()}.xlsx`);
            toast.success('Items issued report downloaded successfully');
        },
        onError: () => toast.error('Failed to export items issued report'),
    });
}

/**
 * Alias with new terminology
 */
export function useExportItemsIssued() {
    return useExportSales();
}

/**
 * Export stock report
 */
export function useExportStock() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportStock(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `inventory_report_${new Date().getTime()}.xlsx`);
            toast.success('Inventory report downloaded successfully');
        },
        onError: () => toast.error('Failed to export inventory report'),
    });
}

/**
 * Alias with new terminology
 */
export function useExportInventory() {
    return useExportStock();
}

/**
 * Export items received report
 */
export function useExportPurchases() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportPurchases(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `items_received_report_${new Date().getTime()}.xlsx`);
            toast.success('Items received report downloaded successfully');
        },
        onError: () => toast.error('Failed to export items received report'),
    });
}

/**
 * Alias with new terminology
 */
export function useExportItemsReceived() {
    return useExportPurchases();
}

/**
 * Export returns report
 */
export function useExportLending() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportLending(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `returns_report_${new Date().getTime()}.xlsx`);
            toast.success('Returns report downloaded successfully');
        },
        onError: () => toast.error('Failed to export returns report'),
    });
}

/**
 * Alias with new terminology
 */
export function useExportReturns() {
    return useExportLending();
}

/**
 * Export low stock report
 */
export function useExportLowStock() {
    return useMutation({
        mutationFn: () => reportsService.exportLowStock(),
        onSuccess: (data) => {
            handleBlobDownload(data, `low_stock_report_${new Date().getTime()}.xlsx`);
            toast.success('Low stock report downloaded successfully');
        },
        onError: () => toast.error('Failed to export low stock report'),
    });
}

/**
 * Export category report
 */
export function useExportCategory() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportCategory(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `category_report_${new Date().getTime()}.xlsx`);
            toast.success('Category report downloaded successfully');
        },
        onError: () => toast.error('Failed to export category report'),
    });
}

/**
 * Export supplier report
 */
export function useExportSupplier() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportSupplier(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `supplier_report_${new Date().getTime()}.xlsx`);
            toast.success('Supplier report downloaded successfully');
        },
        onError: () => toast.error('Failed to export supplier report'),
    });
}
