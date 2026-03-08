import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportsService } from '@/services/reports.service';
import { UtilsService } from '@/services/utils.service';
import { toast } from 'sonner';

const reportsService = new ReportsService(new UtilsService());

export function useIncomeReport(params?: { startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ['reports', 'income', params],
        queryFn: () => reportsService.getIncomeReport(params),
    });
}

function handleBlobDownload(data: any, filename: string) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
}

export function useExportSales() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportSales(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `sales_report_${new Date().getTime()}.xlsx`);
            toast.success('Sales report downloaded successfully');
        },
        onError: () => toast.error('Failed to export sales report'),
    });
}

export function useExportStock() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportStock(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `stock_report_${new Date().getTime()}.xlsx`);
            toast.success('Stock report downloaded successfully');
        },
        onError: () => toast.error('Failed to export stock report'),
    });
}

export function useExportLending() {
    return useMutation({
        mutationFn: (params?: { startDate?: string; endDate?: string }) => reportsService.exportLending(params),
        onSuccess: (data) => {
            handleBlobDownload(data, `lending_report_${new Date().getTime()}.xlsx`);
            toast.success('Lending report downloaded successfully');
        },
        onError: () => toast.error('Failed to export lending report'),
    });
}
