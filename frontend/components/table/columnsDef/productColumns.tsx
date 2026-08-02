'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { formatValue } from '@/lib/utils';

export const getProductColumns = (
    onEdit: (product: Product) => void,
    onDelete: (product: Product) => void
): ColumnDef<Product>[] => {
    return [
        {
            accessorKey: 'assetId',
            header: 'Asset ID',
            cell: ({ row }) => (
                <span className="font-mono text-sm font-semibold text-blue-600">
                    {row.original.assetId || `#${row.original.id}`}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Item Name',
        },
        {
            accessorKey: 'category',
            header: 'Category',
        },
        {
            accessorKey: 'supplier',
            header: 'Supplier',
            cell: ({ row }) => (
                <span>{row.original.supplier || '-'}</span>
            ),
        },
        {
            accessorKey: 'quantity',
            header: 'InStock',
            cell: ({ row }) => {
                const qty = row.original.quantity;
                const lowStock = row.original.lowStockThreshold;
                const isLow = qty <= lowStock;
                return (
                    <span className={`font-semibold ${isLow ? 'text-red-500' : 'text-green-600'}`}>
                        {formatValue(qty)}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                            <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(product)}>
                            <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                );
            },
        },
    ];
};
