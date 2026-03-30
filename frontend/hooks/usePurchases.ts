import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PurchasesService, CreatePurchaseDto, CreateBulkPurchaseDto } from '@/services/purchases.service';
import { UtilsService } from '@/services/utils.service';
import { Purchase } from '@/types/stock';
import { toast } from 'sonner';

const purchasesService = new PurchasesService(new UtilsService());

interface PurchasesResponse {
    items: Purchase[];
    total: number;
    page: number;
    limit: number;
}

interface PurchasesQuery {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    supplier?: string;
    search?: string;
}

export const usePurchases = (query: PurchasesQuery = {}) => {
    return useQuery<PurchasesResponse>({
        queryKey: ['purchases', query],
        queryFn: () => purchasesService.getPurchases(query),
    });
};

export const useCreatePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePurchaseDto) => purchasesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success('Purchase recorded successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record purchase');
        },
    });
};

export const useCreateBulkPurchase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBulkPurchaseDto) => purchasesService.createBulk(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            toast.success(`${data.length} purchases recorded successfully`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record bulk purchases');
        },
    });
};