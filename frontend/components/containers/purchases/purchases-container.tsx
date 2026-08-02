'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getPurchasesColumns } from '@/components/table/columnsDef/purchasesColumns';
import { usePurchases, useDeletePurchase } from '@/hooks/usePurchases';
import { PaginationState } from '@tantml:react-table';
import { useDebounce } from 'use-debounce';
import { Purchase } from '@/types/stock';
import PurchasesDialog from './purchases-dialog';
import BulkPurchasesDialog from './bulk-purchases-dialog';
import PurchaseViewDialog from './purchase-view-dialog';
import BulkConfirmDialog from '@/components/common/bulk-action-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ExportColumn, formatCurrency, formatDateTime } from '@/utils/export-utils';

const PurchasesContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    
    const [openDialog, setOpenDialog] = useState(false);
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewPurchase, setViewPurchase] = useState<Purchase | null>(null);
    
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    const deletePurchaseMutation = useDeletePurchase();
    
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const { isLoading, data } = usePurchases({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        from: dateRange.from?.toISOString().split('T')[0],
        to: dateRange.to?.toISOString().split('T')[0],
    });

    const handleView = (purchase: Purchase) => {
        setViewPurchase(purchase);
        setViewOpen(true);
    };

    const handleEdit = (purchase: Purchase) => {
        // For now, just view - edit functionality can be added later
        handleView(purchase);
    };

    const handleDeleteClick = (purchase: Purchase) => {
        setSelectedPurchase(purchase);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedPurchase) {
            await deletePurchaseMutation.mutateAsync(selectedPurchase.id);
            setDeleteOpen(false);
            setSelectedPurchase(null);
        }
    };

    const purchasesColumns = getPurchasesColumns(handleEdit, handleDeleteClick);

    // Export configuration
    const exportConfig: { filename: string; title: string; columns: ExportColumn[] } = {
        filename: 'items-received-report',
        title: 'Items Received Report',
        columns: [
            { key: 'product.name', label: 'Item Name' },
            { key: 'product.brand', label: 'Brand' },
            { key: 'quantityPurchased', label: 'Quantity Received' },
            { key: 'pricePerUnit', label: 'Price Per Unit', format: formatCurrency },
            { key: 'totalValue', label: 'Total Value', format: formatCurrency },
            { key: 'supplier', label: 'Supplier' },
            { key: 'purchaseDate', label: 'Receiving Date', format: formatDateTime },
        ],
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Items Received</h1>
                
                <div className="flex items-center gap-2">
                    <Button onClick={() => setOpenDialog(true)} variant="outline">
                        Single Receipt
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-secondary-blue text-white">
                                Record Receipt
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                                Single Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenBulkDialog(true)}>
                                Bulk Receipt Entry
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <DataTable<Purchase>
                columns={purchasesColumns}
                data={data?.items ?? []}
                isLoading={isLoading}
                heading=""
                count={data?.total ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                page={pagination.pageIndex}
                limit={pagination.pageSize}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search by item name, supplier..."
                dateFilter={{
                    enabled: true,
                    value: dateRange,
                    onChange: setDateRange,
                }}
                exportConfig={exportConfig}
                onRowClick={handleView}
            />

            {openDialog && <PurchasesDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}

            {openBulkDialog && <BulkPurchasesDialog
                open={openBulkDialog}
                onOpenChange={setOpenBulkDialog}
            />}

            {viewOpen && <PurchaseViewDialog
                purchase={viewPurchase}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />}

            {deleteOpen && <BulkConfirmDialog
                open={deleteOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteOpen(false)}
                type="delete"
                entityLabel="Receipt Record"
                count={1}
                loading={deletePurchaseMutation.isPending}
            />}
        </div>
    );
};

export default PurchasesContainer;