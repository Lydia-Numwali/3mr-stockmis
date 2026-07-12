'use client';

import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { getLendingColumns } from '@/components/table/columnsDef/lendingColumns';
import { useLending } from '@/hooks/useLending';
import { PaginationState } from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { Lending } from '@/types/stock';
import ReturnDialog from './return-dialog';
import LendingViewDialog from './lending-view-dialog';

const LendingContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const [openDialog, setOpenDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedLending, setSelectedLending] = useState<Lending | null>(null);
    
    const [viewOpen, setViewOpen] = useState(false);
    const [viewLending, setViewLending] = useState<Lending | null>(null);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });

    const { isLoading, data } = useLending({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
    });

    const handleView = (lending: Lending) => {
        setViewLending(lending);
        setViewOpen(true);
    };

    const handleEdit = (lending: Lending) => {
        // For now, just view - edit functionality can be added later
        handleView(lending);
    };

    const handleDelete = (lending: Lending) => {
        if (confirm(`Delete return record for ${lending.product?.name}?`)) {
            // TODO: Implement delete functionality
            console.log('Delete lending:', lending.id);
        }
    };

    const lendingColumns = getLendingColumns(handleEdit, handleDelete);

    return (
        <div className="w-full">
            <DataTable<Lending>
                columns={lendingColumns}
                data={data?.items ?? []}
                isLoading={isLoading}
                heading="Item Returns"
                addButtonIcon="solar:hand-money-bold"
                addButtonTitle="Record Return"
                onAdd={() => setOpenDialog(true)}
                count={data?.total ?? 0}
                pagination={pagination}
                setPagination={setPagination}
                page={pagination.pageIndex}
                limit={pagination.pageSize}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Search by item name, returned by..."
                onRowClick={handleView}
            />

            {openDialog && <ReturnDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
            />}

            {viewOpen && <LendingViewDialog
                lending={viewLending}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />}
        </div>
    );
};

export default LendingContainer;
