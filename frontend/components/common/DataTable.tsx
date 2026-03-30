import React, {
  Dispatch,
  HTMLProps,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Icon } from '@iconify/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, ListFilter, Loader2 } from 'lucide-react';
import Input from '../auth/Input';
import FormDatePicker from './FormDatePicker';
import AttendanceLabels from './AttendanceLabels';
import TableSkeleton from './TableSkeleton';
import FilterSelect from './FilterSelect';
import DateRangeFilter from './DateRangeFilter';
import { handleDownloadAll } from '@/utils/download-all';
import { exportToExcel, exportToPDF, printTable, ExportColumn } from '@/utils/export-utils';
import { useTranslations } from 'next-intl';

// Removed IFilterOption since it was only used for the old appointment system filtering and its component was deleted
type Filter<T> = {
  id: Extract<keyof T, string>;
  type:
  | 'text'
  | 'date-range'
  | 'select'
  | 'institution'
  | 'gender'
  | 'country'
  | 'role';
  options?: string[];
};

interface DataTableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  zipDownload?: boolean;
  page?: number;
  message?: string;
  limit: number;
  description?: string;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  selectable?: boolean;
  heading?: string;
  type?: string;
  vfilters?: {
    statuses?: { value: string; label: string; icon: string }[];
    currentStatus?: string;
    onStatusChange?: (value: string) => void;
    onFilterClick?: () => void;
  };
  selectedItems?: string[] | null;
  handleRowSelection?: (ids: string[]) => void;
  handleFilter?: (query: any) => void;
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  searchPlaceholder?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  count?: number;
  paginate?: boolean;
  addButtonIcon?: string;
  addButtonTitle?: string;
  filters?: Filter<T>[];
  searchEnabled?: boolean;
  onAdd?: () => void;
  onExport?: (type: 'excel' | 'pdf' | 'print') => void;
  exportLoading?: boolean;
  exportText?: string;
  hideExport?: boolean;
  isCustomFilter?: boolean;
  isAttendanceLables?: boolean;
  customFilter?: React.ReactNode;
  tableCustomFilter?: React.ReactNode;
  emptyState?: React.ReactNode;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: Dispatch<SetStateAction<Record<string, boolean>>>;
  bulkOperator?: React.ReactNode;
  // Date filter props
  dateFilter?: {
    value: { from?: Date; to?: Date };
    onChange: (range: { from?: Date; to?: Date }) => void;
    enabled?: boolean;
  };
  // Export configuration
  exportConfig?: {
    filename: string;
    title: string;
    columns: ExportColumn[];
  };
}

const DataTable = <T extends Record<string, any>>({
  data = [],
  columns = [],
  limit,
  selectable,
  isCustomFilter,
  message,
  heading,
  description,
  isLoading,
  handleRowSelection,
  handleFilter,
  pagination,
  setPagination,
  addButtonIcon,
  zipDownload,
  count = 0,
  addButtonTitle,
  filters = [],
  searchEnabled = true,
  searchQuery,
  setSearchQuery,
  searchPlaceholder,
  onAdd,
  exportText,
  onExport,
  exportLoading,
  isAttendanceLables,
  hideExport = false,
  customFilter,
  tableCustomFilter,
  vfilters,
  emptyState,
  rowSelection = {},
  setRowSelection = () => { },
  bulkOperator,
  dateFilter,
  exportConfig,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const updateFilter = (id: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [id]: value }));
  };

  // Enhanced export function
  const handleExport = (type: 'excel' | 'pdf' | 'print') => {
    if (!exportConfig) {
      onExport?.(type);
      return;
    }

    const { filename, title, columns: exportColumns } = exportConfig;
    
    switch (type) {
      case 'excel':
        exportToExcel({ filename, title, columns: exportColumns, data });
        break;
      case 'pdf':
        exportToPDF({ filename, title, columns: exportColumns, data });
        break;
      case 'print':
        printTable({ filename, title, columns: exportColumns, data });
        break;
    }
  };

  // FIX: Safe filtering function
  const filterFunction = (row: any, columnId: string, filterValue: any) => {
    if (!filterValue) return true;
    const cellValue = row.getValue(columnId);
    if (typeof filterValue === 'string') {
      return cellValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
    }
    if (filterValue.startDate && filterValue.endDate) {
      const rowDate = new Date(cellValue);
      return rowDate >= new Date(filterValue.startDate) && rowDate <= new Date(filterValue.endDate);
    }
    return true;
  };

  useEffect(() => {
    if (
      searchQuery &&
      searchInputRef.current &&
      document.activeElement !== searchInputRef.current
    ) {
      const cursorPosition = searchInputRef.current.selectionStart ?? searchQuery.length;
      searchInputRef.current.focus();
      searchInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [searchQuery]);

  const columnFilters = useMemo(
    () => Object.entries(filterValues).map(([id, value]) => ({ id, value })),
    [filterValues]
  );

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, pagination, columnFilters, sorting },
    getRowId: (row, index) => (row as T)?.id ?? index.toString(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    enableRowSelection: true,
    filterFns: { customFilter: filterFunction },
    pageCount: Math.max(1, Math.ceil(count / limit)),
    manualPagination: true,
  });

  return (
    <div className={cn('rounded-xl pb-[10px] overflow-x-auto border bg-white')}>
      <div className="flex flex-col gap-4 p-6">
        {(!vfilters || heading) && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {heading && (
                <h2 className="text-base font-semibold leading-6 text-gray whitespace-nowrap capitalize">
                  {heading}
                </h2>
              )}
              {heading && (
                <div className="rounded-full px-2 py-[2px] bg-light-gray border border-border-color">
                  <h2 className="text-xs text-blue text-center font-medium">
                    {count ?? data.length}
                  </h2>
                </div>
              )}
            </div>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        )}

        {/* SEARCH & FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {searchEnabled && (
              <div className="flex border rounded-xl py-3 px-4 w-full max-w-[400px] items-center gap-2">
                <Icon icon="solar:magnifer-linear" width={24} height={24} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder ?? t('tables.common.search')}
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  className="px-1 flex-1 outline-none"
                />
              </div>
            )}

            {dateFilter?.enabled && (
              <DateRangeFilter
                value={dateFilter.value}
                onChange={dateFilter.onChange}
                placeholder="Filter by date"
              />
            )}
          </div>

          <div className={cn('flex items-center justify-end gap-4 flex-1')}>
            {vfilters && vfilters.statuses && (
              <FilterSelect
                filters={vfilters.statuses}
                value={vfilters.currentStatus}
                onChange={vfilters.onStatusChange!}
                placeholder="Filter"
              />
            )}
            {zipDownload && data.length > 0 && (
              <Button
                onClick={() => {
                  handleDownloadAll();
                }}
                className="bg-secondary-blue hover:bg-secondary-blue/90 text-white rounded-xl px-4 py-6"
              >
                <Icon icon="subway:zip" width={24} height={24} />
                Download All as ZIP
              </Button>
            )}
            {!hideExport && !zipDownload && !isLoading && data.length > 0 && (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="text-white bg-secondary-blue hover:bg-secondary-blue/90 rounded-xl shadow-inner-custom-dark px-[23px] py-6">
                      {exportLoading ? (
                        <Loader2
                          className="animate-spin mr-2 text-white"
                          fontSize={24}
                        />
                      ) : (
                        <>
                          <Icon
                            icon={'solar:download-bold'}
                            fontSize={20}
                            className="text-white mr-2"
                          />
                          <span className="text-sm">Export</span>
                          <Icon
                            icon="mingcute:down-line"
                            width="20"
                            height="20"
                          />
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => handleExport('excel')}>
                      Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('print')}>
                      Print
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {addButtonIcon && addButtonTitle && (
              <Button onClick={onAdd} disabled={isLoading} className="bg-secondary-blue text-white rounded-xl px-[23px] py-[13px] h-12 shadow-inner-custom">
                <Icon icon={addButtonIcon} fontSize={20} />
                <span className="text-sm ml-2">{addButtonTitle}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={columns.length} rows={limit} showCheckbox={selectable} />
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Icon icon="solar:box-minimalistic-broken" width={48} height={48} className="mb-3 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">{message || 'No data available'}</h3>
            <p className="text-sm text-gray-500">{addButtonTitle ? 'Click the button above to add new data' : 'Check back later for updates'}</p>
          </div>
        ) : (
          <Table className="min-w-[900px] w-full font-medium">
            <TableHeader>
              <TableRow className="bg-secondary-blue text-white">
                {selectable && (
                  <TableHead>
                    <IndeterminateCheckbox
                      checked={table.getIsAllRowsSelected()}
                      indeterminate={table.getIsSomeRowsSelected()}
                      onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                  </TableHead>
                )}
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="!py-2 !px-6 font-semibold text-base">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-[#f2f5f9]')}>
                  {selectable && (
                    <TableCell className="py-2 px-6">
                      <IndeterminateCheckbox
                        checked={row.getIsSelected()}
                        indeterminate={row.getIsSomeSelected()}
                        onChange={row.getToggleSelectedHandler()}
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2 px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {!isLoading && data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, count)} of {count} results
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows per page:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  setPagination(prev => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    pageIndex: 0
                  }));
                }}
                className="border rounded px-2 py-1 text-sm bg-white"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: 0 }))}
                disabled={pagination.pageIndex === 0}
                className="h-8 w-8 p-0"
              >
                <Icon icon="solar:double-alt-arrow-left-bold" className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                disabled={pagination.pageIndex === 0}
                className="h-8 w-8 p-0"
              >
                <Icon icon="solar:alt-arrow-left-bold" className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 mx-2">
                <span className="text-sm text-gray-600">
                  Page {pagination.pageIndex + 1} of {Math.max(1, Math.ceil(count / pagination.pageSize))}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                disabled={pagination.pageIndex >= Math.ceil(count / pagination.pageSize) - 1}
                className="h-8 w-8 p-0"
              >
                <Icon icon="solar:alt-arrow-right-bold" className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.ceil(count / pagination.pageSize) - 1 }))}
                disabled={pagination.pageIndex >= Math.ceil(count / pagination.pageSize) - 1}
                className="h-8 w-8 p-0"
              >
                <Icon icon="solar:double-alt-arrow-right-bold" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !rest.checked && !!indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <div className="h-full flex items-center justify-center">
      <input
        type="checkbox"
        ref={ref}
        className={`${className} cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500`}
        {...rest}
      />
    </div>
  );
}
