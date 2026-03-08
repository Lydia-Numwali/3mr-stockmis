import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SalesService, CreateSaleDto } from '@/services/sales.service';
import { UtilsService } from '@/services/utils.service';
import { toast } from 'sonner';

const salesService = new SalesService(new UtilsService());

export function useSalesHistory(params?: any) {
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
