'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Lending } from '@/types/stock';
import { formatValue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export const getLendingColumns = (
    onEdit: (lending: Lending) => void,
    onDelete: (lending: Lending) => void
): ColumnDef<Lending>[] => {
    return [
        {
            accessorKey: 'product',
            header: 'Item Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.product?.name || 'Unknown'}</span>
            ),
        },
        {
            accessorKey: 'returnedBy',
            header: 'Returned By',
            cell: ({ row }) => {
                const returnedBy = row.original.returnedBy ?? row.original.borrowerShop;
                return returnedBy || '-';
            },
        },
        {
            accessorKey: 'quantityReturned',
            header: 'Quantity Returned',
            cell: ({ row }) => {
                const qty = row.original.quantityReturned ?? row.original.quantityLent;
                return <span className="font-semibold text-orange-500">{formatValue(qty)}</span>;
            },
        },
        {
            accessorKey: 'returnReason',
            header: 'Return Reason',
            cell: ({ row }) => row.original.returnReason || '-',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;
                let color = 'bg-gray-500';
                if (status === 'RESTOCKED') color = 'bg-green-500';
                if (status === 'INSPECTED') color = 'bg-blue-500';
                if (status === 'RECEIVED') color = 'bg-orange-500';
                if (status === 'SENT_FOR_REPAIR') color = 'bg-yellow-500';
                if (status === 'DISPOSED') color = 'bg-red-500';

                return <Badge className={`${color} text-white`}>{status.replace('_', ' ')}</Badge>;
            },
        },
        {
            accessorKey: 'returnDate',
            header: 'Return Date',
            cell: ({ row }) => {
                const date = row.original.returnDate ?? row.original.dateLent;
                return dayjs(date).format('DD MMM YYYY');
            },
        },
        {
            accessorKey: 'itemCondition',
            header: 'Condition',
            cell: ({ row }) => {
                const condition = row.original.itemCondition;
                return condition || '-';
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const lending = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(lending);
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
                                onDelete(lending);
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
