'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getProductColumns } from '@/components/table/columnsDef/productColumns';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { Product } from '@/types/stock';
import ProductDialog from './products-dialog';
import ProductViewDialog from './product-view-dialog';
import BulkConfirmDialog from '@/components/common/bulk-action-dialog';
import { ExportColumn, formatCurrency } from '@/utils/export-utils';

const ProductsContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    
    // Date range filters
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const [viewOpen, setViewOpen] = useState(false);
    const [viewProduct, setViewProduct] = useState<Product | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const deleteProductMutation = useDeleteProduct();

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const { isLoading, data } = useProducts({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
    });

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setDialogType('edit');
        setOpenDialog(true);
    };

    const handleView = (product: Product) => {
        setViewProduct(product);
        setViewOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedProduct) {
            await deleteProductMutation.mutateAsync(selectedProduct.id);
            setDeleteOpen(false);
        }
    };

    const productColumns = getProductColumns(handleEdit, handleDeleteClick);

    // Filter data by date range for display and export
    const filteredData = React.useMemo(() => {
        if (!data?.items) return [];
        
        let filtered = data.items;
        
        if (dateFrom || dateTo) {
            filtered = filtered.filter(item => {
                const itemDate = item.dateRecorded ? new Date(item.dateRecorded) : new Date(item.updatedAt || '');
                const from = dateFrom ? new Date(dateFrom) : null;
                const to = dateTo ? new Date(dateTo) : null;
                
                if (from && itemDate < from) return false;
                if (to && itemDate > to) return false;
                
                return true;
            });
        }
        
        return filtered;
    }, [data?.items, dateFrom, dateTo]);

    // Export configuration
    const exportConfig: { filename: string; title: string; columns: ExportColumn[] } = {
        filename: 'logistics-items-report',
        title: 'Logistics Items Inventory Report',
        columns: [
            { key: 'assetId', label: 'Asset ID', format: (val, row) => val || `#${row.id}` },
            { key: 'name', label: 'Item Name' },
            { key: 'category', label: 'Category' },
            { key: 'model', label: 'Model/Spec' },
            { key: 'brand', label: 'Brand' },
            { key: 'quantity', label: 'InStock' },
        ],
    };

    return (
        <div className="w-full space-y-4">
            {/* Date Range Filters */}
            <div className="flex gap-3 items-end bg-white p-4 rounded-lg border">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">From Date</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">To Date</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {(dateFrom || dateTo) && (
                    <button
                        onClick={() => {
                            setDateFrom('');
                            setDateTo('');
                        }}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <DataTable<Product>
                columns={productColumns}
                data={filteredData}
                isLoading={isLoading}
                heading="Logistics Items"
                addButtonIcon="solar:box-minimalistic-bold"
                addButtonTitle="Add Logistics Item"
                onAdd={() => {
                    setSelectedProduct(null);
                    setDialogType('add');
                    setOpenDialog(true);
                }}
                count={data?.total ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                page={pagination.pageIndex}
                limit={pagination.pageSize}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search item name or brand..."
                exportConfig={exportConfig}
                onRowClick={handleView}
            />

            {openDialog && <ProductDialog
                type={dialogType}
                product={selectedProduct}
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}

            {viewOpen && <ProductViewDialog
                product={viewProduct}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />}

            {deleteOpen && <BulkConfirmDialog
                open={deleteOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteOpen(false)}
                type="delete"
                entityLabel="Logistics Item"
                count={1}
                loading={deleteProductMutation.isPending}
            />}
        </div>
    );
};

export default ProductsContainer;
