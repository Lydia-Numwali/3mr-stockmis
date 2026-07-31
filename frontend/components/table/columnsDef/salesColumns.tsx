'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Sale } from '@/types/stock';
import { formatValue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export const getSalesColumns = (
    onEdit: (sale: Sale) => void,
    onDelete: (sale: Sale) => void
): ColumnDef<Sale>[] => {
    return [
        {
            accessorKey: 'product',
            header: 'Item Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.product?.name || 'Unknown'}</span>
            ),
        },
        {
            accessorKey: 'quantityIssued',
            header: 'QTY',
            cell: ({ row }) => {
                const qty = row.original.quantityIssued ?? row.original.quantitySold;
                return <span className="font-semibold text-red-500">{formatValue(qty)}</span>;
            },
        },
        {
            accessorKey: 'assetId',
            header: 'Asset ID',
            cell: ({ row }) => row.original.assetId || '-',
        },
        {
            accessorKey: 'serialNumber',
            header: 'Serial Number',
            cell: ({ row }) => row.original.serialNumber || '-',
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => row.original.location || '-',
        },
        {
            accessorKey: 'custodian',
            header: 'Custodian',
            cell: ({ row }) => row.original.custodian || '-',
        },
        {
            accessorKey: 'condition',
            header: 'Condition',
            cell: ({ row }) => row.original.condition || '-',
        },
        {
            accessorKey: 'issuedTo',
            header: 'Issued To',
            cell: ({ row }) => {
                const issuedTo = row.original.issuedTo ?? row.original.customerName;
                return <span className="font-medium">{issuedTo || '-'}</span>;
            },
        },
        {
            accessorKey: 'issueDate',
            header: 'Issue Date',
            cell: ({ row }) => {
                const date = row.original.issueDate ?? row.original.saleDate ?? row.original.date;
                return dayjs(date).format('DD MMM YYYY');
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const sale = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(sale);
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
                                onDelete(sale);
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
