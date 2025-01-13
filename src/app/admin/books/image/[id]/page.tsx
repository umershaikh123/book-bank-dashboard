"use client"
import Image from "next/image"
import Header from "@/app/components/Header"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/navigation"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { useSearchParams } from "next/navigation"
import { Fade } from "@mui/material"
import { Suspense } from "react"
import { DeleteBookPopover } from "@/app/components/Popover"
import { useState } from "react"
const ImagePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookDetails = {
    title: searchParams.get("title") || "No Title",
    author: searchParams.get("author") || "Unknown Author",
    category: searchParams.get("category") || "N/A",
    totalCopies: searchParams.get("totalCopies") || "N/A",
    availableCopies: searchParams.get("availableCopies") || "N/A",
    price: searchParams.get("price") || "N/A",
    image: searchParams.get("image") || "/Images/booksData/image1.svg",
  }

  console.log("bookDetails", bookDetails)
  const [openDelete, setOpenDelete] = useState(false)
  const handleOpenDelete = () => setOpenDelete(true)
  const handleCloseDelete = () => setOpenDelete(false)

  return (
    <Suspense
      fallback={
        <div className="justify-center items-center h-[60vh]  w-full flex">
          <div className="loader"></div>
        </div>
      }
    >
      <div className="flex flex-col h-screen bg-gradient-to-b from-yellow-50 to-white rounded-[2rem] overflow-y-clip ">
        <Header page={"Books"} searchBarToggle={true} />
        <DeleteBookPopover handleClose={handleCloseDelete} open={openDelete} bookTitle={bookDetails.title} />
        <Fade in={true} timeout={300}>
          <div className="">
            <button
              onClick={() => router.push("/admin/books?booksCategory=all")}
              className=" group mt-5 ml-16 bg-[#282828] px-8 py-2 rounded-3xl flex items-center border-2  hover:bg-yellow-50 hover:text-[#282828]  border-[#282828] text-white duration-300 ease-in-out transition-all"
            >
              <ArrowBackIcon
                sx={{
                  color: "white",
                  fontSize: "20px",
                  mr: "8px",
                }}
                className="group-hover:text-[#282828] duration-300 ease-in-out transition-all"
              />
              Back
            </button>
            <div className="flex items-center justify-center w-full h-[70vh]">
              <div className="flex justify-evenly  bg-white rounded-3xl shadow-md shadow-black w-fit h-[25rem] px-10 py-6">
                <img src={bookDetails.image} alt={bookDetails.title as string} width={250} height={250} />

                <div className="flex flex-col justify-evenly space-y-8 text-[var(--secondary)] ml-8 mt-4">
                  <div>
                    <h1 className="font-bold text-3xl">{bookDetails.title}</h1>
                    <p className="text-slate-400 text-xs font-semibold">{bookDetails.author}</p>
                  </div>
                  <div className="space-y-5">
                    <p className="text-sm">
                      <strong>Category:</strong> {bookDetails.category}
                    </p>
                    <p className="text-sm">
                      <strong>Total Copies:</strong> {bookDetails.totalCopies}
                    </p>

                    <p className="text-sm">
                      <strong>Available Copies:</strong> {bookDetails.availableCopies}
                    </p>
                    <p className="text-sm">
                      <strong>Price:</strong> {bookDetails.price || "N/A"} rs
                    </p>
                  </div>
                  <div className="flex justify-center items-center w-full space-x-6 text-white font-semibold">
                    <button className="bg-[var(--secondary)] border-2 transition-all duration-300 ease-in-out border-[var(--secondary)] hover:bg-white hover:text-[var(--secondary)] px-6 py-2 flex items-center w-32 justify-center rounded-lg">
                      Edit
                    </button>
                    <button
                      onClick={handleOpenDelete}
                      className="bg-[#FF2F2F] hover:bg-white hover:text-[#FF2F2F] border-2 transition-all duration-300 ease-in-out border-[#FF2F2F] px-6 py-2 flex items-center w-32 justify-center rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </Suspense>
  )
}

export default ImagePage
