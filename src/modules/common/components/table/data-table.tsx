'use client'
import { useState, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/common/components/table/table'
import DataTableFilters from './data-table-filters'
import { DataTablePagination } from './data-table-pagination'
import DataTableRowsCounter from './data-table-rows-counter'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isColumnFilterEnabled?: boolean
  selectedData?: any
  setSelectedData?: (data: any) => void
  onSelectedRowsChange?: (lastSelectedRow: any) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isColumnFilterEnabled = true,
  onSelectedRowsChange,
  selectedData,
  setSelectedData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [lastSelectedRow, setLastSelectedRow] = useState<any>('')

  useEffect(() => {
    const handleSelectionState = (selections: RowSelectionState) => {
      setSelectedRows((prev) =>
        Object.keys(selections).map(
          (key) =>
            table.getSelectedRowModel().rowsById[key]?.original ||
            prev.find((row) => row.id === key)
        )
      )
    }

    handleSelectionState(selectedData || rowSelection)
  }, [selectedData || rowSelection])

  useEffect(() => {
    if (!onSelectedRowsChange) return
    onSelectedRowsChange(lastSelectedRow)
  }, [selectedRows])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedData || setRowSelection,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedData || rowSelection,
    },
  })

  return (
    <div className="flex flex-1 flex-col justify-between px-2 gap-2">
      <DataTableFilters
        table={table}
        isColumnFilterEnabled={isColumnFilterEnabled}
      />
      <div className="bg-background rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => {
                    setLastSelectedRow(row.original)
                  }}
                  className="border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row justify-between items-center">
        <DataTableRowsCounter
          selectedRows={table.getSelectedRowModel().rows.length}
          totalRows={table.getFilteredRowModel().rows.length}
        />
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
