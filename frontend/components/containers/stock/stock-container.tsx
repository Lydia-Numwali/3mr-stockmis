'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getStockColumns } from '@/components/table/columnsDef/stockColumns';
import { useStock as useStockMovements } from '@/hooks/useStock';
import { PaginationState } from '@tanstack/react-table';
import { StockMovement } from '@/types/stock';
import StockDialog from './stock-dialog';

const StockContainer = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const { isLoading, data } = useStockMovements({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
    });

    const stockColumns = getStockColumns();

    return (
        <div className="w-full">
            <DataTable<StockMovement>
                columns={stockColumns}
                data={data?.items ?? []}
                isLoading={isLoading}
                heading="Stock Movements"
                addButtonIcon="solar:transfer-horizontal-bold"
                addButtonTitle="Add Stock (IN)"
                onAdd={() => setOpenDialog(true)}
                count={data?.total ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                page={pagination.pageIndex}
                limit={pagination.pageSize}
            />

            {openDialog && <StockDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}
        </div>
    );
};

export default StockContainer;
