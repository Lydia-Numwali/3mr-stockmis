import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PurchasesService, CreatePurchaseDto, CreateBulkPurchaseDto } from '@/services/purchases.service';
import { UtilsService } from '@/services/utils.service';
import { ItemReceived, ItemReceivedFilter, PaginatedResponse } from '@/types/stock';
import { toast } from 'sonner';

const purchasesService = new PurchasesService(new UtilsService());

/**
 * Get all items received with filtering and pagination
 */
export const usePurchases = (query: ItemReceivedFilter = {}) => {
    return useQuery<PaginatedResponse<ItemReceived>>({
        queryKey: ['purchases', query],
        queryFn: () => purchasesService.getPurchases(query),
    });
};

/**
 * Alias with new terminology
 */
export const useItemsReceived = (query: ItemReceivedFilter = {}) => {
    return usePurchases(query);
};

/**
 * Get items received by supplier
 */
export const usePurchasesBySupplier = (supplier: string, params?: { page?: number; limit?: number }) => {
    return useQuery<PaginatedResponse<ItemReceived>>({
        queryKey: ['purchases', 'by-supplier', supplier, params],
        queryFn: () => purchasesService.getBySupplier(supplier, params),
        enabled: !!supplier,
    });
};

/**
 * Get items received by warehouse
 */
export const usePurchasesByWarehouse = (warehouse: string, params?: { page?: number; limit?: number }) => {
    return useQuery<PaginatedResponse<ItemReceived>>({
        queryKey: ['purchases', 'by-warehouse', warehouse, params],
        queryFn: () => purchasesService.getByWarehouse(warehouse, params),
        enabled: !!warehouse,
    });
};

/**
 * Get receiving summary statistics
 */
export const usePurchasesSummary = (params?: { from?: string; to?: string }) => {
    return useQuery({
        queryKey: ['purchases', 'summary', params],
        queryFn: () => purchasesService.getSummary(params),
    });
};

/**
 * Alias with new terminology
 */
export const useReceivingSummary = (params?: { from?: string; to?: string }) => {
    return usePurchasesSummary(params);
};

/**
 * Record a new items received transaction
 */
export const useCreatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePurchaseDto) => purchasesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Items received recorded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record items received');
        },
    });
};

/**
 * Alias with new terminology
 */
export const useRecordItemsReceived = () => {
    return useCreatePurchase();
};

/**
 * Record multiple items received in one transaction
 */
export const useCreateBulkPurchase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBulkPurchaseDto) => purchasesService.createBulk(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success(`${data.length} items received recorded successfully`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record bulk items received');
        },
    });
};

/**
 * Alias with new terminology
 */
export const useRecordBulkItemsReceived = () => {
    return useCreateBulkPurchase();
};

/**
 * Update an items received record
 */
export const useUpdatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreatePurchaseDto> }) => 
            purchasesService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Items received record updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update items received record');
        },
    });
};

/**
 * Delete an items received record
 */
export const useDeletePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => purchasesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Items received record deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete items received record');
        },
    });
};