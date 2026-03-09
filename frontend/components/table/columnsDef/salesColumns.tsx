'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Sale } from '@/types/stock';
import { formatValue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';

export const getSalesColumns = (): ColumnDef<Sale>[] => {
    return [
        {
            accessorKey: 'product',
            header: 'Product Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.product?.name || 'Unknown'}</span>
            ),
        },
        {
            accessorKey: 'quantitySold',
            header: 'Qty Sold',
            cell: ({ row }) => <span className="font-semibold text-red-500">{formatValue(row.original.quantitySold)}</span>,
        },
        {
            accessorKey: 'priceUsed',
            header: 'Price Used',
            cell: ({ row }) => formatValue(row.original.priceUsed),
        },
        {
            accessorKey: 'totalValue',
            header: 'Total Sale Value',
            cell: ({ row }) => (
                <span className="font-semibold text-green-600">
                    {formatValue(row.original.quantitySold * row.original.priceUsed)}
                </span>
            ),
        },
        {
            accessorKey: 'saleType',
            header: 'Sale Type',
            cell: ({ row }) => {
                const type = row.original.saleType;
                const color = type === 'WHOLESALE' ? 'bg-purple-500' : 'bg-blue-500';
                return <Badge className={`${color} text-white`}>{type}</Badge>;
            },
        },
        {
            accessorKey: 'customerType',
            header: 'Customer Type',
            cell: ({ row }) => row.original.customerType ? row.original.customerType.replace('_', ' ') : '-',
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => dayjs(row.original.date).format('DD MMM YYYY HH:mm'),
        },
    ];
};
