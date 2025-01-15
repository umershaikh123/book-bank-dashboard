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
import { RequestMonitorDrawer } from "@/app/components/Drawer"
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
    initialState: {
      sorting: [{ id: "form_number", desc: true }],
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

  const getRequestStatusStyles = (status: "borrowed" | "returned" | "NotReturned") => {
    switch (status) {
      case "borrowed":
        return "text-yellow-600"

      case "returned":
        return "text-green-600"
      case "NotReturned":
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
                <TableHead key={header.id} className="cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
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
                        cell.column.id === "borrowed_status"
                          ? `  font-medium  ${getRequestStatusStyles(cell.getValue() as "borrowed" | "returned" | "NotReturned")}`
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

      {selectedRow && <RequestMonitorDrawer open={drawerOpen} onClose={closeDrawer} formData={selectedRow} />}
    </div>
  )
}
