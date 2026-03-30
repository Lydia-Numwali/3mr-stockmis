'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Purchase } from '@/types/stock';
import { formatValue } from '@/lib/utils';
import dayjs from 'dayjs';

export const getPurchasesColumns = (): ColumnDef<Purchase>[] => {
    return [
        {
            accessorKey: 'product',
            header: 'Product Name',
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
            accessorKey: 'quantityPurchased',
            header: 'Quantity',
            cell: ({ row }) => (
                <span className="font-semibold text-blue-600">
                    {formatValue(row.original.quantityPurchased)}
                </span>
            ),
        },
        {
            accessorKey: 'purchaseDate',
            header: 'Date',
            cell: ({ row }) => {
                const date = row.original.purchaseDate || row.original.date;
                return dayjs(date).format('DD MMM YYYY HH:mm');
            },
        },
        {
            accessorKey: 'pricePerUnit',
            header: 'Purchase Price',
            cell: ({ row }) => (
                <span className="font-semibold text-green-600">
                    Frws {formatValue(row.original.pricePerUnit)}
                </span>
            ),
        },
        {
            accessorKey: 'totalValue',
            header: 'Total Value',
            cell: ({ row }) => (
                <span className="font-semibold text-green-700">
                    Frws {formatValue(row.original.totalValue || (row.original.quantityPurchased * row.original.pricePerUnit))}
                </span>
            ),
        },
    ];
};