"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import ImportExportIcon from "@mui/icons-material/ImportExport"
// Define the shape of your form data
export type Form = {
  name: string
  father_name: string
  student_cnic: string
  mobile: string
  request_status: "Pending" | "Approved" | "Accepted" | "Rejected"
  book_return_date: string
  timestamp: string
  form_number: number
}

// Define the table columns
export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: "form_number",

    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-2">
          Form No
          <ImportExportIcon className="h-4 w-4" />
        </Button>
      )
    },

    cell: ({ row }) => <div className="font-semibold max-w-[5rem] flex justify-center">{row.getValue("form_number")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "father_name",
    header: "Father's Name",
  },
  {
    accessorKey: "student_cnic",
    header: "CNIC",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },

  {
    accessorKey: "book_return_date",
    header: "Return Date",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
  },
  {
    accessorKey: "request_status",
    header: "Status",
  },
]
