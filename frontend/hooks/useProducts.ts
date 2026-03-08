import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductsService, CreateProductDto } from '@/services/products.service';
import { UtilsService } from '@/services/utils.service';
import { toast } from 'sonner';

const productsService = new ProductsService(new UtilsService());

export function useProducts(params?: any) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productsService.findAll(params),
    });
}

export function useProduct(id: number) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productsService.findOne(id),
        enabled: !!id,
    });
}

export function useBestSellingProducts() {
    return useQuery({
        queryKey: ['products', 'best-selling'],
        queryFn: () => productsService.getBestSelling(),
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductDto) => productsService.create(data),
        onSuccess: () => {
            toast.success('Product created successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create product');
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateProductDto> }) => productsService.update(id, data),
        onSuccess: () => {
            toast.success('Product updated successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update product');
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => productsService.delete(id),
        onSuccess: () => {
            toast.success('Product deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete product');
        },
    });
}
