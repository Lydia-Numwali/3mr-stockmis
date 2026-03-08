'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ArrowUpDown } from 'lucide-react';
import { formatValue } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export const getProductColumns = (
    onEdit: (product: Product) => void,
    onDelete: (product: Product) => void
): ColumnDef<Product>[] => {
    return [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <span className="capitalize">{row.original.category.replace('_', ' ')}</span>
            ),
        },
        {
            accessorKey: 'quantity',
            header: 'Stock Qty',
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
            accessorKey: 'retailPrice',
            header: 'Retail Price',
            cell: ({ row }) => formatValue(row.original.retailPrice),
        },
        {
            accessorKey: 'wholesalePrice',
            header: 'Wholesale Price',
            cell: ({ row }) => formatValue(row.original.wholesalePrice),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <div className="flex items-center gap-2">
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
