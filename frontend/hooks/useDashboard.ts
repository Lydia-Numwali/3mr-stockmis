import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboard.service';
import { UtilsService } from '@/services/utils.service';
import { DashboardStats } from '@/types/stock';

const dashboardService = new DashboardService(new UtilsService());

/**
 * Get overall dashboard statistics
 */
export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => dashboardService.getStats(),
    });
}

/**
 * Get items issued trend chart data
 */
export function useSalesChart(period: 'week' | 'month' | 'year' = 'month') {
    return useQuery({
        queryKey: ['dashboard', 'sales-chart', period],
        queryFn: () => dashboardService.getSalesChart(period),
    });
}

/**
 * Alias with new terminology
 */
export function useIssueTrend(period: 'week' | 'month' | 'year' = 'month') {
    return useQuery({
        queryKey: ['dashboard', 'issue-trend', period],
        queryFn: () => dashboardService.getIssueTrend(period),
    });
}

/**
 * Get logistics item category breakdown
 */
export function useCategoryBreakdown() {
    return useQuery({
        queryKey: ['dashboard', 'category-breakdown'],
        queryFn: () => dashboardService.getCategoryBreakdown(),
    });
}

/**
 * Get low stock alerts
 */
export function useLowStockAlerts() {
    return useQuery({
        queryKey: ['dashboard', 'low-stock'],
        queryFn: () => dashboardService.getLowStockAlerts(),
    });
}

/**
 * Get out of stock items
 */
export function useOutOfStockItems() {
    return useQuery({
        queryKey: ['dashboard', 'out-of-stock'],
        queryFn: () => dashboardService.getOutOfStockItems(),
    });
}

/**
 * Get recent receiving activity
 */
export function useRecentReceiving(limit: number = 10) {
    return useQuery({
        queryKey: ['dashboard', 'recent-receiving', limit],
        queryFn: () => dashboardService.getRecentReceiving({ limit }),
    });
}

/**
 * Get recent issue activity
 */
export function useRecentIssues(limit: number = 10) {
    return useQuery({
        queryKey: ['dashboard', 'recent-issues', limit],
        queryFn: () => dashboardService.getRecentIssues({ limit }),
    });
}

/**
 * Get items pending inspection
 */
export function usePendingInspectionStats() {
    return useQuery({
        queryKey: ['dashboard', 'pending-inspection'],
        queryFn: () => dashboardService.getPendingInspection(),
    });
}

/**
 * Get items under repair
 */
export function useItemsUnderRepairStats() {
    return useQuery({
        queryKey: ['dashboard', 'under-repair'],
        queryFn: () => dashboardService.getItemsUnderRepair(),
    });
}

/**
 * Get damaged items count
 */
export function useDamagedItemsStats() {
    return useQuery({
        queryKey: ['dashboard', 'damaged-items'],
        queryFn: () => dashboardService.getDamagedItems(),
    });
}

/**
 * Get inventory by warehouse
 */
export function useInventoryByWarehouse() {
    return useQuery({
        queryKey: ['dashboard', 'inventory-by-warehouse'],
        queryFn: () => dashboardService.getInventoryByWarehouse(),
    });
}

/**
 * Get department-wise issue statistics
 */
export function useDepartmentStats() {
    return useQuery({
        queryKey: ['dashboard', 'department-stats'],
        queryFn: () => dashboardService.getDepartmentStats(),
    });
}

/**
 * Get security site-wise issue statistics
 */
export function useSiteStats() {
    return useQuery({
        queryKey: ['dashboard', 'site-stats'],
        queryFn: () => dashboardService.getSiteStats(),
    });
}

/**
 * Get top issued items
 */
export function useTopIssuedItems(limit: number = 10) {
    return useQuery({
        queryKey: ['dashboard', 'top-issued', limit],
        queryFn: () => dashboardService.getTopIssuedItems({ limit }),
    });
}

/**
 * Get inventory value statistics
 */
export function useInventoryValue() {
    return useQuery({
        queryKey: ['dashboard', 'inventory-value'],
        queryFn: () => dashboardService.getInventoryValue(),
    });
}
