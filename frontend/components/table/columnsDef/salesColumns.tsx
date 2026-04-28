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
            accessorKey: 'paymentStatus',
            header: 'Payment',
            cell: ({ row }) => {
                const status = row.original.paymentStatus || 'PAID';
                const colors = {
                    PAID: 'bg-green-500',
                    CREDIT: 'bg-red-500',
                    PARTIAL: 'bg-yellow-500'
                };
                return <Badge className={`${colors[status as keyof typeof colors]} text-white`}>{status}</Badge>;
            },
        },
        {
            accessorKey: 'amountDue',
            header: 'Amount Due',
            cell: ({ row }) => {
                const due = row.original.amountDue || 0;
                return due > 0 ? (
                    <span className="font-semibold text-red-600">{formatValue(due)}</span>
                ) : (
                    <span className="text-gray-400">-</span>
                );
            },
        },
        {
            accessorKey: 'customerName',
            header: 'Customer Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.customerName || 'Walk-in Customer'}</span>
            ),
        },
        {
            accessorKey: 'saleDate',
            header: 'Sale Date',
            cell: ({ row }) => dayjs(row.original.saleDate).format('DD MMM YYYY HH:mm'),
        },
    ];
};
