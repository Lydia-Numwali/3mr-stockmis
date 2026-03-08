'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getProductColumns } from '@/components/table/columnsDef/productColumns';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { Product } from '@/types/stock';
import ProductDialog from './products-dialog';
import BulkConfirmDialog from '@/components/common/bulk-action-dialog';

const ProductsContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

    return (
        <div className="w-full">
            <DataTable<Product>
                columns={productColumns}
                data={data?.items ?? []}
                isLoading={isLoading}
                heading="Products"
                addButtonIcon="solar:box-minimalistic-bold"
                addButtonTitle="Add Product"
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
                searchPlaceholder="Search product name or part..."
            />

            {openDialog && <ProductDialog
                type={dialogType}
                product={selectedProduct}
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}

            {deleteOpen && <BulkConfirmDialog
                open={deleteOpen}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteOpen(false)}
                type="delete"
                entityLabel="Product"
                count={1}
                loading={deleteProductMutation.isPending}
            />}
        </div>
    );
};

export default ProductsContainer;
