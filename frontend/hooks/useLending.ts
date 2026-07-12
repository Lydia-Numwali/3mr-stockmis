import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LendingService, CreateLendingDto, ReturnLendingDto } from '@/services/lending.service';
import { UtilsService } from '@/services/utils.service';
import { ItemReturn, ItemReturnFilter, PaginatedResponse, InspectReturnDto, IssueReplacementDto } from '@/types/stock';
import { toast } from 'sonner';

const lendingService = new LendingService(new UtilsService());

/**
 * Get all item returns with filtering and pagination
 */
export function useLending(params?: ItemReturnFilter) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', params],
        queryFn: () => lendingService.findAll(params),
    });
}

/**
 * Alias with new terminology
 */
export function useItemReturns(params?: ItemReturnFilter) {
    return useLending(params);
}

/**
 * Get returns by status
 */
export function useReturnsByStatus(status: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', 'by-status', status, params],
        queryFn: () => lendingService.getByStatus(status, params),
        enabled: !!status,
    });
}

/**
 * Get returns by condition
 */
export function useReturnsByCondition(condition: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', 'by-condition', condition, params],
        queryFn: () => lendingService.getByCondition(condition, params),
        enabled: !!condition,
    });
}

/**
 * Get returns by department
 */
export function useReturnsByDepartment(department: string, params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', 'by-department', department, params],
        queryFn: () => lendingService.getByDepartment(department, params),
        enabled: !!department,
    });
}

/**
 * Get returns pending inspection
 */
export function usePendingInspection(params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', 'pending-inspection', params],
        queryFn: () => lendingService.getPendingInspection(params),
    });
}

/**
 * Get items under repair
 */
export function useItemsUnderRepair(params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', 'under-repair', params],
        queryFn: () => lendingService.getUnderRepair(params),
    });
}

/**
 * Get damaged items
 */
export function useDamagedItems(params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', 'damaged', params],
        queryFn: () => lendingService.getDamaged(params),
    });
}

/**
 * Get items that were replaced
 */
export function useReplacedItems(params?: { page?: number; limit?: number }) {
    return useQuery<PaginatedResponse<ItemReturn>>({
        queryKey: ['lending', 'replaced', params],
        queryFn: () => lendingService.getReplaced(params),
    });
}

/**
 * Get return summary statistics
 */
export function useReturnsSummary(params?: { from?: string; to?: string }) {
    return useQuery({
        queryKey: ['lending', 'summary', params],
        queryFn: () => lendingService.getSummary(params),
    });
}

/**
 * Get overdue items (legacy - may not be applicable for returns)
 * @deprecated Use usePendingInspection instead
 */
export function useOverdueLending() {
    return useQuery<ItemReturn[]>({
        queryKey: ['lending', 'overdue'],
        queryFn: () => lendingService.getOverdue(),
    });
}

/**
 * Record a new item return
 */
export function useCreateLending() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateLendingDto) => lendingService.create(data),
        onSuccess: () => {
            toast.success('Item return recorded successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record item return');
        },
    });
}

/**
 * Alias with new terminology
 */
export function useRecordItemReturn() {
    return useCreateLending();
}

/**
 * Inspect a returned item and update its condition
 */
export function useInspectReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: InspectReturnDto }) => 
            lendingService.inspectReturn(id, data),
        onSuccess: () => {
            toast.success('Item inspected successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to inspect item');
        },
    });
}

/**
 * Issue a replacement item for a damaged/defective return
 */
export function useIssueReplacement() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: IssueReplacementDto }) => 
            lendingService.issueReplacement(id, data),
        onSuccess: () => {
            toast.success('Replacement item issued successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to issue replacement');
        },
    });
}

/**
 * Mark return as restocked (good condition items)
 */
export function useRestockReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => lendingService.restockReturn(id),
        onSuccess: () => {
            toast.success('Item restocked successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to restock item');
        },
    });
}

/**
 * Send item for repair
 */
export function useSendForRepair() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data?: { notes?: string } }) => 
            lendingService.sendForRepair(id, data),
        onSuccess: () => {
            toast.success('Item sent for repair');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to send item for repair');
        },
    });
}

/**
 * Mark item as disposed (beyond repair)
 */
export function useDisposeItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data?: { notes?: string } }) => 
            lendingService.disposeItem(id, data),
        onSuccess: () => {
            toast.success('Item marked for disposal');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to dispose item');
        },
    });
}

/**
 * Legacy method for backward compatibility
 * @deprecated Use useInspectReturn or useIssueReplacement instead
 */
export function useReturnLending() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ReturnLendingDto }) => 
            lendingService.returnLending(id, data),
        onSuccess: () => {
            toast.success('Item returned successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to return item');
        },
    });
}

/**
 * Update a return record
 */
export function useUpdateReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateLendingDto> }) => 
            lendingService.update(id, data),
        onSuccess: () => {
            toast.success('Return record updated successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update return record');
        },
    });
}

/**
 * Delete a return record
 */
export function useDeleteReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => lendingService.delete(id),
        onSuccess: () => {
            toast.success('Return record deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['lending'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete return record');
        },
    });
}
