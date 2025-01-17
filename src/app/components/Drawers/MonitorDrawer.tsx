import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"

import { FormData } from "@/app/admin/monitor/page"
import { useQuery } from "@tanstack/react-query"
import { BookType } from "@/app/lib/Books/fetcher"
import Lottie from "lottie-react"

// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { useHandleFormStatus } from "../handleBorrowedStatus"
const fetchBooks = async (booksRequired: { book_title: string }[] | undefined) => {
  if (!booksRequired || booksRequired.length === 0) return []
  const token = localStorage.getItem("auth_token")
  const titles = booksRequired.map((book) => book.book_title).join(",")
  const response = await fetch(`/api/database/books/select/where?titles=${encodeURIComponent(titles)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch books")
  }

  const data = await response.json()

  return data.data
}

export function RequestMonitorDrawer({
  open,
  onClose,
  formData,
}: {
  open: boolean
  onClose: () => void
  formData: FormData | {}
}) {
  const isValidFormData = (data: FormData | {}): data is FormData => {
    return "books_required" in data && Array.isArray((data as FormData).books_required) && "name" in data && "mobile" in data
  }
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books", isValidFormData(formData) ? formData.books_required : null],
    queryFn: async () => {
      if (isValidFormData(formData)) {
        return await fetchBooks(formData.books_required)
      }
      return []
    },
    refetchOnWindowFocus: false,
    enabled: isValidFormData(formData),
  })

  const [openNotReturnedDialog, setOpenNotReturnedDialog] = useState(false)

  const [openReturnedDialog, setOpenReturnedDialog] = useState(false)
  const { handleNotReturned, handleReturned } = useHandleFormStatus()

  return (
    <Drawer open={open} anchor="right" onClose={onClose}>
      <Box className="w-[26rem] p-4 bg-white shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">User Details</h2>
        {isValidFormData(formData) ? (
          <>
            {/* User Details */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Form Number:</span>
                <span>{formData.form_number}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">User Name:</span>
                <span>{formData.name}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Father Name:</span>
                <span>{formData.father_name}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Mobile No:</span>
                <span>{formData.mobile}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">CNIC:</span>
                <span>{formData.student_cnic}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Address:</span>
                <span className="max-w-[16rem] text-right">{formData.address}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Return Data:</span>
                <span className="max-w-[16rem] text-right">{formData.book_return_date}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Borrowed Status:</span>
                <span
                  className={`px-2 py-1 rounded ${
                    formData.borrowed_status === "borrowed"
                      ? "bg-yellow-100 text-yellow-800"
                      : formData.borrowed_status === "returned"
                      ? "bg-green-100 text-green-800 "
                      : formData.borrowed_status === "NotReturned"
                      ? "bg-red-100 text-red-800"
                      : " bg-blue-100  text-blue-800 "
                  }`}
                >
                  {formData.borrowed_status}
                </span>
              </div>
            </div>

            {/* Books Required */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Books Required:</h3>
            {isLoading ? (
              <div className="justify-center items-center h-[40vh]  w-full flex">
                <div className="loader"></div>
              </div>
            ) : isError ? (
              <p className="text-red-500">
                Error fetching books: {error instanceof Error ? error.message : "Unknown error"}
                <div className="justify-center items-center h-fit w-full flex flex-col">
                  <Lottie style={{ height: 200, width: 200 }} animationData={notFoundAnimation} loop={true} />

                  <h1 className="text-xl font-bold text-gray-300">Books not Found</h1>
                </div>
              </p>
            ) : books && books.length > 0 ? (
              <div className="space-y-4">
                {books.map((book: BookType, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out"
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      width={70}
                      height={70}
                      className=" max-w-[85px] max-h-[85px]     rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{book.title}</h4>
                      <p className="text-sm text-gray-600">Author: {book.author}</p>
                      <p className="text-sm text-gray-600">Category: {book.category}</p>
                      <p className="text-sm text-gray-600">
                        Available: {book.availableCopies} / {book.totalCopies}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">{book.price} rs</span>
                    </div>
                  </div>
                ))}

                {formData.borrowed_status === "borrowed" && (
                  <div className=" pt-8 w-full  flex  items-center justify-evenly pb-8">
                    <Button variant="destructive" size={"lg"} onClick={() => setOpenNotReturnedDialog(true)}>
                      Not Returned
                    </Button>
                    <Button
                      className="bg-green-100 text-green-800 hover:border-green-800 border "
                      size={"lg"}
                      onClick={() => setOpenReturnedDialog(true)}
                    >
                      Returned
                    </Button>
                  </div>
                )}

                <Dialog open={openReturnedDialog} onOpenChange={setOpenReturnedDialog}>
                  <DialogContent className="bg-white z-[1500]">
                    <DialogHeader>
                      <DialogTitle>Confirm Acceptance</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to Accept this student request ?</DialogDescription>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setOpenReturnedDialog(false)} className="border-2">
                        Cancel
                      </Button>
                      <Button
                        className="bg-green-100 text-green-800 hover:border-green-800 border "
                        onClick={() => handleReturned(formData.form_number, setOpenReturnedDialog, onClose)}
                      >
                        Return
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={openNotReturnedDialog} onOpenChange={setOpenNotReturnedDialog}>
                  <DialogContent className="bg-white z-[1500]">
                    <DialogHeader>
                      <DialogTitle>Confirm Rejection</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to Reject this student request ?</DialogDescription>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setOpenNotReturnedDialog(false)} className="border-2">
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleNotReturned(formData.form_number, setOpenNotReturnedDialog, onClose)}
                      >
                        Not Return
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="justify-center items-center h-fit w-full flex flex-col">
                <Lottie style={{ height: 200, width: 200 }} animationData={notFoundAnimation} loop={true} />

                <h1 className="text-xl font-bold text-gray-300">Books not Found</h1>
              </div>
            )}
          </>
        ) : (
          <div className="justify-center items-center h-fit w-full flex flex-col">
            <Lottie style={{ height: 200, width: 200 }} animationData={notFoundAnimation} loop={true} />

            <h1 className="text-xl font-bold text-gray-300">Data not available</h1>
          </div>
        )}
      </Box>
    </Drawer>
  )
}
