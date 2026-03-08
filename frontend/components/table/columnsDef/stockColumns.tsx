'use client';

import { ColumnDef } from '@tanstack/react-table';
import { StockMovement } from '@/types/stock';
import { formatValue } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';

export const getStockColumns = (): ColumnDef<StockMovement>[] => {
    return [
        {
            accessorKey: 'product',
            header: 'Product Name',
            cell: ({ row }) => (
                <span className="font-medium">{row.original.product?.name || 'Unknown'}</span>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Movement Type',
            cell: ({ row }) => {
                const type = row.original.type;
                let color = 'bg-gray-500';
                if (type === 'IN') color = 'bg-green-500 hover:bg-green-600';
                if (type === 'OUT') color = 'bg-red-500 hover:bg-red-600';
                if (type === 'LEND') color = 'bg-orange-500 hover:bg-orange-600';
                if (type === 'RETURN') color = 'bg-blue-500 hover:bg-blue-600';

                return <Badge className={`${color} text-white`}>{type}</Badge>;
            },
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
            cell: ({ row }) => {
                const type = row.original.type;
                const sign = type === 'IN' || type === 'RETURN' ? '+' : '-';
                return <span className="font-semibold">{sign}{formatValue(row.original.quantity)}</span>;
            },
        },
        {
            accessorKey: 'supplier',
            header: 'Supplier',
            cell: ({ row }) => row.original.supplier || '-',
        },
        {
            accessorKey: 'purchasePrice',
            header: 'Purchase Price',
            cell: ({ row }) => row.original.purchasePrice ? formatValue(row.original.purchasePrice) : '-',
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => dayjs(row.original.date).format('DD MMM YYYY HH:mm'),
        },
    ];
};
