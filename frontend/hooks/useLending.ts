import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LendingService, CreateLendingDto, ReturnLendingDto } from '@/services/lending.service';
import { UtilsService } from '@/services/utils.service';
import { toast } from 'sonner';

const lendingService = new LendingService(new UtilsService());

export function useLending(params?: any) {
    return useQuery({
        queryKey: ['lending', params],
        queryFn: () => lendingService.findAll(params),
    });
}

export function useOverdueLending() {
    return useQuery({
        queryKey: ['lending', 'overdue'],
        queryFn: () => lendingService.getOverdue(),
    });
}

export function useCreateLending() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLendingDto) => lendingService.create(data),
        onSuccess: () => {
            toast.success('Lending recorded successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record lending');
        },
    });
}

export function useReturnLending() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ReturnLendingDto }) => lendingService.returnLending(id, data),
        onSuccess: () => {
            toast.success('Lending returned successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to return lending');
        },
    });
}
