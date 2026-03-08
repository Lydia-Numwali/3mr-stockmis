'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Lending } from '@/types/stock';
import { formatValue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export const getLendingColumns = (
    onReturn: (lending: Lending) => void
): ColumnDef<Lending>[] => {
    return [
        {
            accessorKey: 'product',
            header: 'Product Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.product?.name || 'Unknown'}</span>
            ),
        },
        {
            accessorKey: 'borrowerShop',
            header: 'Borrower (Shop/Person)',
            cell: ({ row }) => row.original.borrowerShop,
        },
        {
            accessorKey: 'quantityLent',
            header: 'Qty Lent',
            cell: ({ row }) => <span className="font-semibold text-orange-500">{formatValue(row.original.quantityLent)}</span>,
        },
        {
            accessorKey: 'quantityReturned',
            header: 'Qty Returned',
            cell: ({ row }) => (
                <span className="font-semibold text-green-600">
                    {formatValue(row.original.quantityReturned)}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                let color = 'bg-gray-500';
                if (status === 'RETURNED') color = 'bg-green-500';
                if (status === 'PARTIALLY_RETURNED') color = 'bg-yellow-500';
                if (status === 'PENDING') color = 'bg-orange-500';

                return <Badge className={`${color} text-white`}>{status.replace('_', ' ')}</Badge>;
            },
        },
        {
            accessorKey: 'dateLent',
            header: 'Date Lent',
            cell: ({ row }) => dayjs(row.original.dateLent).format('DD MMM YYYY'),
        },
        {
            accessorKey: 'expectedReturnDate',
            header: 'Expected Return',
            cell: ({ row }) => {
                if (!row.original.expectedReturnDate) return '-';
                const isOverdue = dayjs(row.original.expectedReturnDate).isBefore(dayjs()) && row.original.status !== 'RETURNED';
                return (
                    <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
                        {dayjs(row.original.expectedReturnDate).format('DD MMM YYYY')}
                    </span>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const lending = row.original;
                if (lending.status === 'RETURNED') return null;

                return (
                    <Button variant="outline" size="sm" onClick={() => onReturn(lending)} className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Return
                    </Button>
                );
            },
        },
    ];
};
