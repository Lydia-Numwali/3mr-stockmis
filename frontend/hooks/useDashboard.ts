import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboard.service';
import { UtilsService } from '@/services/utils.service';

const dashboardService = new DashboardService(new UtilsService());

export function useDashboardStats() {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => dashboardService.getStats(),
    });
}

export function useSalesChart(period: 'week' | 'month' | 'year' = 'month') {
    return useQuery({
        queryKey: ['dashboard', 'sales-chart', period],
        queryFn: () => dashboardService.getSalesChart(period),
    });
}

export function useCategoryBreakdown() {
    return useQuery({
        queryKey: ['dashboard', 'category-breakdown'],
        queryFn: () => dashboardService.getCategoryBreakdown(),
    });
}

export function useLowStockAlerts() {
    return useQuery({
        queryKey: ['dashboard', 'low-stock'],
        queryFn: () => dashboardService.getLowStockAlerts(),
    });
}
