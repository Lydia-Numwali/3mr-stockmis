'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getPurchasesColumns } from '@/components/table/columnsDef/purchasesColumns';
import { usePurchases } from '@/hooks/usePurchases';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { Purchase } from '@/types/stock';
import PurchasesDialog from './purchases-dialog';
import BulkPurchasesDialog from './bulk-purchases-dialog';
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

    const purchasesColumns = getPurchasesColumns();

    // Export configuration
    const exportConfig: { filename: string; title: string; columns: ExportColumn[] } = {
        filename: 'purchases-report',
        title: 'Purchases Report',
        columns: [
            { key: 'product.name', label: 'Product Name' },
            { key: 'product.brand', label: 'Brand' },
            { key: 'quantityPurchased', label: 'Quantity Purchased' },
            { key: 'pricePerUnit', label: 'Price Per Unit', format: formatCurrency },
            { key: 'totalValue', label: 'Total Value', format: formatCurrency },
            { key: 'supplier', label: 'Supplier' },
            { key: 'purchaseDate', label: 'Purchase Date', format: formatDateTime },
        ],
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Purchases History</h1>
                
                <div className="flex items-center gap-2">
                    <Button onClick={() => setOpenDialog(true)} variant="outline">
                        Single Purchase
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-secondary-blue text-white">
                                Add Purchase
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                                Single Purchase
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenBulkDialog(true)}>
                                Bulk Purchase Entry
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
                searchPlaceholder="Search by product name, supplier..."
                dateFilter={{
                    enabled: true,
                    value: dateRange,
                    onChange: setDateRange,
                }}
                exportConfig={exportConfig}
            />

            {openDialog && <PurchasesDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}

            {openBulkDialog && <BulkPurchasesDialog
                open={openBulkDialog}
                onOpenChange={setOpenBulkDialog}
            />}
        </div>
    );
};

export default PurchasesContainer;