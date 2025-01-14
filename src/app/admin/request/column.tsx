"use client"

import { ColumnDef } from "@tanstack/react-table"

// Define the shape of your form data
export type Form = {
  name: string
  father_name: string
  student_cnic: string
  mobile: string
  request_status: "Pending" | "Approved" | "Accepted" | "Rejected"
  book_return_date: string
  timestamp: string
}

// Define the table columns
export const columns: ColumnDef<Form>[] = [
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
