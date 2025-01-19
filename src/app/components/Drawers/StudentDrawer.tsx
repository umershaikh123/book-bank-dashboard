import { Drawer, Box } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import Lottie from "lottie-react"
// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"
import { StudentType } from "@/app/admin/students/column"
import { fetchBooks } from "./fetchBooks"

export function StudentDrawer({
  open,
  onClose,
  studentData,
}: {
  open: boolean
  onClose: () => void
  studentData: StudentType | {}
}) {
  const isValidStudentData = (data: StudentType | {}): data is StudentType => {
    return "email" in data && "name" in data && "book_history" in data
  }

  const {
    data: combinedBookDetails,
    isLoading: bookLoading,
    isError: bookError,
    error: bookFetchError,
  } = useQuery({
    queryKey: ["combinedBookDetails", isValidStudentData(studentData) ? studentData.book_history : null],
    queryFn: async () => {
      if (isValidStudentData(studentData)) {
        return await fetchBooks(studentData.book_history)
      }
      return []
    },
    enabled: isValidStudentData(studentData),
  })

  return (
    <Drawer open={open} anchor="right" onClose={onClose}>
      <Box className="w-[30rem]  px-4 pt-4 pb-16  bg-white shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Student Details</h2>
        {isValidStudentData(studentData) ? (
          <>
            {/* Basic Info */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Name:</span>
                <span>{studentData.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Father's Name:</span>
                <span>{studentData.father_name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">CNIC:</span>
                <span>{studentData.student_cnic}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Mobile:</span>
                <span>{studentData.mobile}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-600">Email:</span>
                <span>{studentData.email}</span>
              </div>
              <div className="flex justify-between file:">
                <span className="font-semibold text-gray-600">Address:</span>
                <span className="max-w-[16rem] text-right">{studentData.address}</span>
              </div>

              {studentData.totalBooksNotReturned > 0 && (
                <div className="flex justify-between mt-2">
                  <span className="font-semibold text-gray-600">Not Returned Books:</span>
                  <span className="font-semibold bg-red-100 text-red-800 px-4 rounded-lg">
                    {studentData.totalBooksNotReturned}
                  </span>
                </div>
              )}

              <div className="flex justify-between mt-2">
                <span className="font-semibold text-gray-600">Returned Books:</span>
                <span className="font-semibold bg-green-100 text-green-800 px-4 rounded-lg">
                  {studentData.totalBooksReturned}
                </span>
              </div>

              <div className="flex justify-between mt-2">
                <span className="font-semibold text-gray-600">Borrowed Books:</span>
                <span className="font-semibold bg-yellow-100 text-yellow-800 px-4 rounded-lg">
                  {studentData.totalBooksBorrowed}
                </span>
              </div>
            </div>

            {/* Current Borrowed Books */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Currently Borrowed Books:</h3>
            {studentData.current_borrowed.length > 0 ? (
              <div className="space-y-4">
                {studentData.current_borrowed.map((book, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{book.book_title}</h4>
                      <p className="text-sm text-gray-600">Return Date: {book.return_date}</p>
                      <p className="text-sm text-gray-600">Status: {book.borrowed_status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No books currently borrowed.</p>
            )}

            {/* Book History */}
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Book History:</h3>
            {bookLoading ? (
              <div className="justify-center items-center h-[40vh] w-full flex">
                <div className="loader"></div>
              </div>
            ) : bookError ? (
              <p className="text-red-500">
                Error fetching book history: {bookFetchError instanceof Error ? bookFetchError.message : "Unknown error"}
              </p>
            ) : combinedBookDetails && combinedBookDetails.length > 0 ? (
              <div className="space-y-4">
                {combinedBookDetails.map((book, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <img src={book.image} alt={book.title} width={70} height={70} className="rounded object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{book.title}</h4>
                      <p className="text-sm text-gray-600">Author: {book.author}</p>
                      <p className="text-sm text-gray-600">Category: {book.category}</p>
                      <p className="text-sm text-gray-600">
                        Available: {book.availableCopies} / {book.totalCopies}
                      </p>
                      <p className="text-sm text-gray-600">Price: {book.price} rs</p>
                      <p className="text-sm text-gray-600">Return Date: {book.return_date}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Status:{" "}
                        <span
                          className={`px-2 py-1 rounded ${
                            book.borrowed_status === "borrowed"
                              ? "bg-yellow-100 text-yellow-800"
                              : book.borrowed_status === "returned"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.borrowed_status}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="justify-center items-center h-fit w-full flex flex-col">
                <Lottie style={{ height: 200, width: 200 }} animationData={notFoundAnimation} loop />
                <h1 className="text-xl font-bold text-gray-300">No Book History Found</h1>
              </div>
            )}
          </>
        ) : (
          <div className="justify-center items-center h-fit w-full flex flex-col">
            <Lottie style={{ height: 200, width: 200 }} animationData={notFoundAnimation} loop />
            <h1 className="text-xl font-bold text-gray-300">Data not available</h1>
          </div>
        )}
      </Box>
    </Drawer>
  )
}
