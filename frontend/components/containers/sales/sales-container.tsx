'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getSalesColumns } from '@/components/table/columnsDef/salesColumns';
import { useSalesHistory as useSales } from '@/hooks/useSales';
import { PaginationState } from '@tanstack/react-table';
import { Sale } from '@/types/stock';
import SalesDialog from './sales-dialog';

const SalesContainer = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const { isLoading, data } = useSales({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const salesColumns = getSalesColumns();

    return (
        <div className="w-full">
            <DataTable<Sale>
                columns={salesColumns}
                data={data?.items ?? []}
                isLoading={isLoading}
                heading="Sales History"
                addButtonIcon="solar:cart-large-minimalistic-bold"
                addButtonTitle="Record Sale"
                onAdd={() => setOpenDialog(true)}
                count={data?.total ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                page={pagination.pageIndex}
                limit={pagination.pageSize}
            />

            {openDialog && <SalesDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}
        </div>
    );
};

export default SalesContainer;
