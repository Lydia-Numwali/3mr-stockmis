import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SalesService, CreateSaleDto, CreateBulkSaleDto } from '@/services/sales.service';
import { UtilsService } from '@/services/utils.service';
import { toast } from 'sonner';

const salesService = new SalesService(new UtilsService());

export function useSalesHistory(params?: {
    page?: number;
    limit?: number;
    search?: string;
    from?: string;
    to?: string;
    saleType?: string;
    customerName?: string;
}) {
    return useQuery({
        queryKey: ['sales', params],
        queryFn: () => salesService.getSales(params),
    });
}

export function useCreateSale() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSaleDto) => salesService.create(data),
        onSuccess: () => {
            toast.success('Sale recorded successfully');
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record sale');
        },
    });
}

export function useCreateBulkSale() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBulkSaleDto) => salesService.createBulk(data),
        onSuccess: (data) => {
            toast.success(`${data.length} sales recorded successfully`);
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record bulk sales');
        },
    });
}
