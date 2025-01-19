"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import ImportExportIcon from "@mui/icons-material/ImportExport"

export type BookRecord = {
  book_title: string
  return_date: string
  borrowed_status: "borrowed" | "returned" | "NotReturned"
}

export type StudentType = {
  name: string
  father_name: string
  student_cnic: string
  mobile: string
  email: string
  address: string
  book_history: BookRecord[]
  current_borrowed: BookRecord[]
  totalBooksBorrowed: number
  totalBooksReturned: number
  totalBooksNotReturned: number
}

export const columns: ColumnDef<StudentType>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "father_name", header: "Father's Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "student_cnic", header: "student_cnic" },
  { accessorKey: "mobile", header: "Mobile" },

  {
    accessorKey: "totalBooksBorrowed",
    header: "Book Set Borrowed",

    cell: ({ row }) => <div className=" text-yellow-600 text-center">{row.getValue("totalBooksBorrowed")}</div>,
  },
  {
    accessorKey: "totalBooksReturned",
    header: "Returned",
    cell: ({ row }) => <div className=" text-green-600 text-center">{row.getValue("totalBooksReturned")}</div>,
  },
  {
    accessorKey: "totalBooksNotReturned",
    header: "Not Returned",
    cell: ({ row }) => <div className=" text-red-600 text-center">{row.getValue("totalBooksNotReturned")}</div>,
  },
]
