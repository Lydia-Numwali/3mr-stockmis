'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Purchase } from '@/types/stock';
import { formatValue } from '@/lib/utils';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export const getPurchasesColumns = (
    onEdit: (purchase: Purchase) => void,
    onDelete: (purchase: Purchase) => void
): ColumnDef<Purchase>[] => {
    return [
        {
            accessorKey: 'product',
            header: 'Item Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.product?.name || 'Unknown'}</span>
            ),
        },
        {
            accessorKey: 'supplier',
            header: 'Supplier',
            cell: ({ row }) => (
                <span className="text-gray-700 dark:text-gray-300">
                    {row.original.supplier || 'N/A'}
                </span>
            ),
        },
        {
            accessorKey: 'quantityReceived',
            header: 'QTY',
            cell: ({ row }) => {
                const qty = row.original.quantityReceived ?? row.original.quantityPurchased;
                return (
                    <span className="font-semibold text-blue-600">
                        {formatValue(qty)}
                    </span>
                );
            },
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => row.original.location || row.original.warehouse || '-',
        },
        {
            accessorKey: 'serialNumber',
            header: 'Serial Number',
            cell: ({ row }) => row.original.serialNumber || '-',
        },
        {
            accessorKey: 'condition',
            header: 'Condition',
            cell: ({ row }) => row.original.condition || '-',
        },
        {
            accessorKey: 'receivingDate',
            header: 'Receiving Date',
            cell: ({ row }) => {
                const date = row.original.receivingDate ?? row.original.purchaseDate ?? row.original.date;
                return dayjs(date).format('DD MMM YYYY');
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const purchase = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(purchase);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(purchase);
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                );
            },
        },
    ];
};
