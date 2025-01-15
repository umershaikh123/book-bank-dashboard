"use client"

import { ColumnDef } from "@tanstack/react-table"

// Define the shape of your form data
export type Form = {
  name: string
  father_name: string
  student_cnic: string
  mobile: string
  borrowed_status: "borrowed" | "returned" | "NotReturned"
  book_return_date: string
  timestamp: string
  form_number: number
}

// Define the table columns
export const columns: ColumnDef<Form>[] = [
  {
    accessorKey: "form_number",
    header: "Form No",
    cell: ({ getValue }: { getValue: any }) => <span className="font-semibold">{getValue()}</span>,
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
    accessorKey: "borrowed_status",
    header: "borrowed Status",
  },
]
