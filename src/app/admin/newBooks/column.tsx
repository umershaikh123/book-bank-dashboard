"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import ImportExportIcon from "@mui/icons-material/ImportExport"
import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import { useToast } from "@/hooks/use-toast"
import { queryClient } from "@/utils/Provider"
export type BookRequestType = {
  book_title: string
  serial_no: number
  timestamp: string
  student_cnic: string
}

export const columns: ColumnDef<BookRequestType>[] = [
  { accessorKey: "serial_no", header: "Serial No" },
  { accessorKey: "book_title", header: "Book Title" },
  { accessorKey: "student_cnic", header: "student_cnic" },
  {
    accessorKey: "timestamp",

    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-2">
          Date of Request
          <ImportExportIcon className="h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)
      const { toast } = useToast()
      const handleDelete = async () => {
        try {
          const response = await fetch("/api/database/requestBooks/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify({ title: row.original.book_title }),
          })
          console.log("response", await response.json())
          if (response.ok) {
            console.log("response ok")
            toast({ title: "Success", description: "Book request deleted successfully", variant: "default" })
            queryClient.invalidateQueries()
          } else {
            console.log("response not ok")
            toast({ title: "Error", description: "Failed to delete book request", variant: "destructive" })
          }
        } catch (err) {
          console.error("Error deleting book request:", err)
          toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
        } finally {
          setOpen(false)
        }
      }

      return (
        <>
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Delete
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to delete the book request for <b>{row.original.book_title}</b>?
              </DialogDescription>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setOpen(false)} className="border-2">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
