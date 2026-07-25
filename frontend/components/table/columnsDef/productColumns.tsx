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
            accessorKey: 'assetId',
            header: 'Asset ID',
            cell: ({ row }) => (
                <span className="font-medium text-sm">{row.original.assetId || '-'}</span>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Asset Description',
        },
        {
            accessorKey: 'category',
            header: 'Category',
        },
        {
            accessorKey: 'serialNumber',
            header: 'Serial Number',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.serialNumber || '-'}</span>
            ),
        },
        {
            accessorKey: 'model',
            header: 'Model',
            cell: ({ row }) => (
                <span>{row.original.model || '-'}</span>
            ),
        },
        {
            accessorKey: 'quantity',
            header: 'QTY',
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
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => (
                <span>{row.original.location || row.original.warehouse || '-'}</span>
            ),
        },
        {
            accessorKey: 'custodian',
            header: 'Custodian',
            cell: ({ row }) => (
                <span>{row.original.custodian || '-'}</span>
            ),
        },
        {
            accessorKey: 'condition',
            header: 'Condition',
            cell: ({ row }) => (
                <span>{row.original.condition || '-'}</span>
            ),
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
