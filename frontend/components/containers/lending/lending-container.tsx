'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getLendingColumns } from '@/components/table/columnsDef/lendingColumns';
import { useLending } from '@/hooks/useLending';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { Lending } from '@/types/stock';
import LendingDialog from './lending-dialog';
import ReturnDialog from './return-dialog';

const LendingContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const [openDialog, setOpenDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedLending, setSelectedLending] = useState<Lending | null>(null);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const { isLoading, data } = useLending({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
    });

    const handleReturnClick = (lending: Lending) => {
        setSelectedLending(lending);
        setOpenReturnDialog(true);
    };

    const lendingColumns = getLendingColumns(handleReturnClick);

    return (
        <div className="w-full">
            <DataTable<Lending>
                columns={lendingColumns}
                data={data?.items ?? []}
                isLoading={isLoading}
                heading="Lending History"
                addButtonIcon="solar:hand-money-bold"
                addButtonTitle="Lend Product"
                onAdd={() => setOpenDialog(true)}
                count={data?.total ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                page={pagination.pageIndex}
                limit={pagination.pageSize}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search by product name, borrower..."
            />

            {openDialog && <LendingDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}

            {openReturnDialog && <ReturnDialog
                open={openReturnDialog}
                onOpenChange={setOpenReturnDialog}
                lending={selectedLending}
            />}
        </div>
    );
};

export default LendingContainer;
