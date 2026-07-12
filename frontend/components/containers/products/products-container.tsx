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

    // Export configuration
    const exportConfig: { filename: string; title: string; columns: ExportColumn[] } = {
        filename: 'logistics-items-report',
        title: 'Logistics Items Inventory Report',
        columns: [
            { key: 'name', label: 'Item Name' },
            { key: 'category', label: 'Category' },
            { key: 'brand', label: 'Brand' },
            { key: 'quantity', label: 'Stock Quantity' },
            { key: 'warehouse', label: 'Warehouse' },
            { key: 'supplier', label: 'Supplier' },
            { key: 'notes', label: 'Notes' },
        ],
    };

    return (
        <div className="w-full">
            <DataTable<Product>
                columns={productColumns}
                data={data?.items ?? []}
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
