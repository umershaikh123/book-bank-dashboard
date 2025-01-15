"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RequestDrawer from "@/app/components/Drawer"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedRow, setSelectedRow] = React.useState<TData | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  const handleRowClick = (row: TData) => {
    setSelectedRow(row)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    // setSelectedRow(null)
  }
  const getRequestStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600"
      case "Approved":
        return "text-blue-600"
      case "Accepted":
        return "text-green-600"
      case "Rejected":
        return "text-red-600"
    }
  }
  return (
    <div className=" shadow-xl      py-4 lg:px-8 px-2  border rounded-3xl  lg:mx-4 mx-2  ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer" onClick={() => handleRowClick(row.original)}>
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment>
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "request_status"
                          ? `  font-medium  ${getRequestStatusStyles(cell.getValue() as string)}`
                          : ""
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {selectedRow && <RequestDrawer open={drawerOpen} onClose={closeDrawer} formData={selectedRow} />}
    </div>
  )
}
