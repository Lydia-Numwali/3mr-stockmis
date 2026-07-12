'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getSalesColumns } from '@/components/table/columnsDef/salesColumns';
import { useSalesHistory as useSales } from '@/hooks/useSales';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { Sale } from '@/types/stock';
import SalesDialog from './sales-dialog';
import SaleViewDialog from './sale-view-dialog';
import BulkSalesDialog from './bulk-sales-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { ExportColumn, formatCurrency, formatDateTime } from '@/utils/export-utils';

const SalesContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    
    const [openDialog, setOpenDialog] = useState(false);
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [viewSale, setViewSale] = useState<Sale | null>(null);
    
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const { isLoading, data } = useSales({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        from: dateRange.from?.toISOString().split('T')[0],
        to: dateRange.to?.toISOString().split('T')[0],
    });

    const handleView = (sale: Sale) => {
        setViewSale(sale);
        setViewOpen(true);
    };

    const handleEdit = (sale: Sale) => {
        // For now, just view - edit functionality can be added later
        handleView(sale);
    };

    const handleDelete = (sale: Sale) => {
        if (confirm(`Delete issue record for ${sale.product?.name}?`)) {
            // TODO: Implement delete functionality
            console.log('Delete sale:', sale.id);
        }
    };

    const salesColumns = getSalesColumns(handleEdit, handleDelete);

    // Export configuration
    const exportConfig: { filename: string; title: string; columns: ExportColumn[] } = {
        filename: 'items-issued-report',
        title: 'Items Issued Report',
        columns: [
            { key: 'product.name', label: 'Item Name' },
            { key: 'product.brand', label: 'Brand' },
            { key: 'quantityIssued', label: 'Quantity Issued' },
            { key: 'priceUsed', label: 'Issue Value', format: formatCurrency },
            { key: 'totalValue', label: 'Total Value', format: formatCurrency },
            { key: 'issuedTo', label: 'Issued To' },
            { key: 'issueDate', label: 'Issue Date', format: formatDateTime },
        ],
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Items Issued</h1>
                
                <div className="flex items-center gap-2">
                    <Button onClick={() => setOpenDialog(true)} variant="outline">
                        Single Issue
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-secondary-blue text-white">
                                Issue Items
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                                Single Issue
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenBulkDialog(true)}>
                                Bulk Issue Entry
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <DataTable<Sale>
                columns={salesColumns}
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
                searchPlaceholder="Search by item name, issued to..."
                dateFilter={{
                    enabled: true,
                    value: dateRange,
                    onChange: setDateRange,
                }}
                exportConfig={exportConfig}
                onRowClick={handleView}
            />

            {openDialog && <SalesDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}

            {viewOpen && <SaleViewDialog
                sale={viewSale}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />}

            {openBulkDialog && <BulkSalesDialog
                open={openBulkDialog}
                onOpenChange={setOpenBulkDialog}
            />}
        </div>
    );
};

export default SalesContainer;
