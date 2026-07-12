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
            header: 'Item Name',
        },
        {
            accessorKey: 'category',
            header: 'Category',
        },
        {
            accessorKey: 'brand',
            header: 'Brand',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.brand || '-'}</span>
            ),
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
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
            accessorKey: 'warehouse',
            header: 'Warehouse',
            cell: ({ row }) => (
                <span>{row.original.warehouse || '-'}</span>
            ),
        },
        {
            accessorKey: 'supplier',
            header: 'Supplier',
            cell: ({ row }) => (
                <span>{row.original.supplier || '-'}</span>
            ),
        },
        {
            accessorKey: 'notes',
            header: 'Notes',
            cell: ({ row }) => {
                const notes = row.original.notes;
                if (!notes) return <span className="text-gray-400">-</span>;
                const truncated = notes.length > 50 ? notes.substring(0, 50) + '...' : notes;
                return <span className="text-sm text-gray-600">{truncated}</span>;
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
