import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"

import { FormData } from "../../admin/request/page"
import { useQuery } from "@tanstack/react-query"
import { BookType } from "../../lib/Books/fetcher"
import Lottie from "lottie-react"
import { Button } from "@/components/ui/button"
// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { useHandleFormStatus } from "../handleFormStatus"

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

export default function RequestDrawer({
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
  const [openRejectDialog, setOpenRejectDialog] = useState(false)
  const [openApproveDialog, setOpenApproveDialog] = useState(false)
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false)
  const { handleReject, handleApprove, handleAccept } = useHandleFormStatus()

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

              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">Request Status:</span>
                <span
                  className={`px-2 py-1 rounded ${
                    formData.request_status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : formData.request_status === "Approved"
                      ? "bg-blue-100  text-blue-800 "
                      : formData.request_status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {formData.request_status}
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
                      className=" max-w-[85px] max-h-[85px]    rounded object-cover"
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

                {formData.request_status === "Pending" && (
                  <div className=" pt-8 w-full  flex  items-center justify-evenly pb-8">
                    <Button variant="destructive" size={"lg"} onClick={() => setOpenRejectDialog(true)}>
                      Reject
                    </Button>
                    <Button
                      className="bg-blue-100 text-blue-800 hover:border-blue-800 border "
                      size={"lg"}
                      onClick={() => setOpenApproveDialog(true)}
                    >
                      Approve
                    </Button>
                  </div>
                )}

                {formData.request_status === "Approved" && (
                  <div className=" pt-8 w-full  flex  items-center justify-evenly pb-8">
                    <Button variant="destructive" size={"lg"} onClick={() => setOpenRejectDialog(true)}>
                      Reject
                    </Button>
                    <Button
                      className="bg-green-100 text-green-800 hover:border-green-800 border "
                      size={"lg"}
                      onClick={() => setOpenAcceptDialog(true)}
                    >
                      Accept
                    </Button>
                  </div>
                )}

                <Dialog open={openAcceptDialog} onOpenChange={setOpenAcceptDialog}>
                  <DialogContent className="bg-white z-[1500]">
                    <DialogHeader>
                      <DialogTitle>Confirm Acceptance</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to Accept this student request ?</DialogDescription>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setOpenAcceptDialog(false)} className="border-2">
                        Cancel
                      </Button>
                      <Button
                        className="bg-green-100 text-green-800 hover:border-green-800 border "
                        onClick={() => handleAccept(formData.form_number, setOpenAcceptDialog, onClose)}
                      >
                        Accept
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
                  <DialogContent className="bg-white z-[1500]">
                    <DialogHeader>
                      <DialogTitle>Confirm Rejection</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to Reject this student request ?</DialogDescription>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setOpenRejectDialog(false)} className="border-2">
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(formData.form_number, setOpenRejectDialog, onClose)}
                      >
                        Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={openApproveDialog} onOpenChange={setOpenApproveDialog}>
                  <DialogContent className="bg-white z-[1500]">
                    <DialogHeader>
                      <DialogTitle>Confirm Approval</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Are you sure you want to Approve this student request ?</DialogDescription>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setOpenApproveDialog(false)} className="border-2">
                        Cancel
                      </Button>
                      <Button
                        className="bg-blue-100 text-blue-800 hover:border-blue-800 border "
                        onClick={() => handleApprove(formData.form_number, setOpenApproveDialog, onClose)}
                      >
                        Approve
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
