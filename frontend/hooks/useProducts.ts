import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductsService, CreateProductDto } from '@/services/products.service';
import { UtilsService } from '@/services/utils.service';
import { LogisticsItem, LogisticsItemFilter, PaginatedResponse } from '@/types/stock';
import { toast } from 'sonner';

const productsService = new ProductsService(new UtilsService());

/**
 * Get all logistics items with filtering and pagination
 */
export function useProducts(params?: LogisticsItemFilter) {
    return useQuery<PaginatedResponse<LogisticsItem>>({
        queryKey: ['products', params],
        queryFn: () => productsService.findAll(params),
    });
}

/**
 * Alias for useProducts with new terminology
 */
export function useLogisticsItems(params?: LogisticsItemFilter) {
    return useProducts(params);
}

/**
 * Get a single logistics item by ID
 */
export function useProduct(id: number) {
    return useQuery<LogisticsItem>({
        queryKey: ['product', id],
        queryFn: () => productsService.findOne(id),
        enabled: !!id,
    });
}

/**
 * Alias for useProduct with new terminology
 */
export function useLogisticsItem(id: number) {
    return useProduct(id);
}

/**
 * Get most frequently issued items
 */
export function useBestSellingProducts() {
    return useQuery<LogisticsItem[]>({
        queryKey: ['products', 'best-selling'],
        queryFn: () => productsService.getBestSelling(),
    });
}

/**
 * Alias with new terminology
 */
export function useMostIssuedItems() {
    return useBestSellingProducts();
}

/**
 * Get logistics items by category
 */
export function useProductsByCategory(category: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<LogisticsItem>>({
        queryKey: ['products', 'by-category', category, params],
        queryFn: () => productsService.getByCategory(category, params),
        enabled: !!category,
    });
}

/**
 * Get logistics items by warehouse
 */
export function useProductsByWarehouse(warehouse: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<LogisticsItem>>({
        queryKey: ['products', 'by-warehouse', warehouse, params],
        queryFn: () => productsService.getByWarehouse(warehouse, params),
        enabled: !!warehouse,
    });
}

/**
 * Get low stock items
 */
export function useLowStockProducts(params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<LogisticsItem>>({
        queryKey: ['products', 'low-stock', params],
        queryFn: () => productsService.getLowStock(params),
    });
}

/**
 * Get out of stock items
 */
export function useOutOfStockProducts(params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<LogisticsItem>>({
        queryKey: ['products', 'out-of-stock', params],
        queryFn: () => productsService.getOutOfStock(params),
    });
}

/**
 * Create a new logistics item
 */
export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductDto) => productsService.create(data),
        onSuccess: () => {
            toast.success('Logistics item created successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create logistics item');
        },
    });
}

/**
 * Alias with new terminology
 */
export function useCreateLogisticsItem() {
    return useCreateProduct();
}

/**
 * Update an existing logistics item
 */
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateProductDto> }) => productsService.update(id, data),
        onSuccess: () => {
            toast.success('Logistics item updated successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update logistics item');
        },
    });
}

/**
 * Alias with new terminology
 */
export function useUpdateLogisticsItem() {
    return useUpdateProduct();
}

/**
 * Delete a logistics item
 */
export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => productsService.delete(id),
        onSuccess: () => {
            toast.success('Logistics item deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete logistics item');
        },
    });
}

/**
 * Alias with new terminology
 */
export function useDeleteLogisticsItem() {
    return useDeleteProduct();
}
