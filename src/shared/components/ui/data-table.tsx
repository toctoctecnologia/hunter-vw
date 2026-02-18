'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  PaginationState,
  OnChangeFn,
} from '@tanstack/react-table';

import { useIsMobile } from '@/shared/hooks/use-mobile';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import { useSidebar } from '@/shared/components/ui/sidebar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number | undefined;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: OnChangeFn<Record<string, boolean>>;
  onSelectionChange?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  setPagination,
  rowSelection,
  setRowSelection,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  const maxWidth = isMobile ? '100%' : open ? 'calc(100vw - 19.8rem)' : 'calc(100vw - 3.7rem)';

  const table = useReactTable({
    data: data,
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onRowSelectionChange:
      setRowSelection ||
      ((updater) => {
        const newRowSelection = typeof updater === 'function' ? updater(table.getState().rowSelection) : updater;

        table.setState((prevState) => ({
          ...prevState,
          rowSelection: newRowSelection,
        }));

        if (onSelectionChange) {
          const selectedRows = table
            .getFilteredRowModel()
            .rows.filter((row) => newRowSelection[row.id])
            .map((row) => row.original);

          onSelectionChange(selectedRows);
        }
      }),
    manualPagination: true,
    state: {
      pagination,
      ...(rowSelection !== undefined && { rowSelection }),
    },
  });

  return (
    <>
      <ScrollArea className="rounded-md border h-[calc(80vh-30px)]" style={{ maxWidth }}>
        <Table className="relative">
          <TableHeader className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-between py-4">
        {!!pageCount && pageCount > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(10, pageCount) }, (_, i) => {
                let page;
                if (pageCount <= 10) {
                  page = i;
                } else if (pagination.pageIndex < 3) {
                  page = i;
                } else if (pagination.pageIndex > pageCount - 3) {
                  page = pageCount - 10 + i;
                } else {
                  page = pagination.pageIndex - 2 + i;
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setPagination({ ...pagination, pageIndex: page })}
                      isActive={pagination.pageIndex === page}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
