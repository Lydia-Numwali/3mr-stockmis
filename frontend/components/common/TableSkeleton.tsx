import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showCheckbox?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 5,
  showCheckbox = false,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showCheckbox && (
            <TableHead className="w-[50px]">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </TableHead>
          )}
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index}>
              <div className="h-6 bg-gray-200 rounded-md animate-pulse" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {showCheckbox && (
              <TableCell>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse ml-3" />
              </TableCell>
            )}
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <div className="h-12 bg-gray-200 rounded-md animate-pulse m-2" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton; 