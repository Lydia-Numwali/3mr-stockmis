import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SalesService, CreateSaleDto, CreateBulkSaleDto } from '@/services/sales.service';
import { UtilsService } from '@/services/utils.service';
import { ItemIssued, ItemIssuedFilter, PaginatedResponse } from '@/types/stock';
import { toast } from 'sonner';

const salesService = new SalesService(new UtilsService());

/**
 * Get all items issued with filtering and pagination
 */
export function useSalesHistory(params?: ItemIssuedFilter) {
    return useQuery<PaginatedResponse<ItemIssued>>({
        queryKey: ['sales', params],
        queryFn: () => salesService.getSales(params),
    });
}

/**
 * Alias with new terminology
 */
export function useItemsIssuedHistory(params?: ItemIssuedFilter) {
    return useSalesHistory(params);
}

/**
 * Get items issued by department
 */
export function useSalesByDepartment(department: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemIssued>>({
        queryKey: ['sales', 'by-department', department, params],
        queryFn: () => salesService.getByDepartment(department, params),
        enabled: !!department,
    });
}

/**
 * Get items issued by security site
 */
export function useSalesBySite(securitySite: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemIssued>>({
        queryKey: ['sales', 'by-site', securitySite, params],
        queryFn: () => salesService.getBySite(securitySite, params),
        enabled: !!securitySite,
    });
}

/**
 * Get items issued to a specific person
 */
export function useSalesByRecipient(issuedTo: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemIssued>>({
        queryKey: ['sales', 'by-recipient', issuedTo, params],
        queryFn: () => salesService.getByRecipient(issuedTo, params),
        enabled: !!issuedTo,
    });
}

/**
 * Get issue summary statistics
 */
export function useSalesSummary(params?: { from?: string; to?: string }) {
    return useQuery({
        queryKey: ['sales', 'summary', params],
        queryFn: () => salesService.getSummary(params),
    });
}

/**
 * Alias with new terminology
 */
export function useIssueSummary(params?: { from?: string; to?: string }) {
    return useSalesSummary(params);
}

/**
 * Issue items to employee/department/site
 */
export function useCreateSale() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSaleDto) => salesService.create(data),
        onSuccess: () => {
            toast.success('Items issued successfully');
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to issue items');
        },
    });
}

/**
 * Alias with new terminology
 */
export function useIssueItems() {
    return useCreateSale();
}

/**
 * Issue multiple items in one transaction
 */
export function useCreateBulkSale() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBulkSaleDto) => salesService.createBulk(data),
        onSuccess: (data) => {
            toast.success(`${data.length} items issued successfully`);
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to issue bulk items');
        },
    });
}

/**
 * Alias with new terminology
 */
export function useIssueBulkItems() {
    return useCreateBulkSale();
}

/**
 * Update an items issued record
 */
export function useUpdateSale() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateSaleDto> }) => 
            salesService.update(id, data),
        onSuccess: () => {
            toast.success('Items issued record updated successfully');
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update items issued record');
        },
    });
}

/**
 * Delete an items issued record
 */
export function useDeleteSale() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => salesService.delete(id),
        onSuccess: () => {
            toast.success('Items issued record deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete items issued record');
        },
    });
}
