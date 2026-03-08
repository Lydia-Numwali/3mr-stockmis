import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StockService, AddStockDto } from '@/services/stock.service';
import { UtilsService } from '@/services/utils.service';
import { toast } from 'sonner';

const stockService = new StockService(new UtilsService());

export function useStock(params?: any) {
    return useQuery({
        queryKey: ['stock', params],
        queryFn: () => stockService.getMovements(params),
    });
}

export function useAddStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AddStockDto) => stockService.addStock(data),
        onSuccess: () => {
            toast.success('Stock added successfully');
            queryClient.invalidateQueries({ queryKey: ['stock'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to add stock');
        },
    });
}
