"use client"
import React, { useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import Header from "@/app/components/Header"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"
import Grid from "@mui/material/Grid2"
import Image from "next/image"
import { Suspense } from "react"
import { AddBookPopover } from "@/app/components/Popover"
import { fetchBooks } from "@/app/lib/Books/fetcher"
import { BookType } from "@/app/lib/Books/fetcher"
import { useQuery } from "@tanstack/react-query"
import { queryClient } from "@/utils/Provider"
import { toast } from "react-toastify"
import Lottie from "lottie-react"
import { Fade } from "@mui/material"
// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"
export default function Page() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const searchParams = useSearchParams()
  const booksCategory = searchParams.get("booksCategory")

  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books", booksCategory],
    queryFn: async () => await fetchBooks(booksCategory || "all"),
    refetchOnWindowFocus: false,
  })

  if (isError) {
    toast.error(`Error: ${error.message}`)
  }

  return (
    <Suspense
      fallback={
        <div className="justify-center items-center h-[60vh]  w-full flex">
          <div className="loader"></div>
        </div>
      }
    >
      <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
        <Header page={"Books"} searchBarToggle={true} />
        <Suspense>
          <ButtonRow handleOpen={handleOpen} booksCategory={booksCategory || "all"} />
        </Suspense>

        <AddBookPopover open={open} handleClose={handleClose} />

        {isLoading && (
          <div className="justify-center items-center h-[60vh]  w-full flex">
            <div className="loader"></div>
          </div>
        )}

        {!isLoading && books?.length === 0 && (
          <div className="justify-center items-center h-[60vh]  w-full flex flex-col">
            <Lottie style={{ height: 600, width: 600 }} animationData={notFoundAnimation} loop={true} />

            <h1 className="text-3xl font-bold text-gray-300">Data not Found</h1>
          </div>
        )}

        <div className="lg:px-16 px-4 my-8  ">
          {!isLoading && !isError && books && (
            <Fade in={true} timeout={300}>
              <Grid
                container
                spacing={4}
                direction="row"
                className="w-full"
                sx={{ justifyContent: "start", alignItems: "center" }}
              >
                {books.map((book: BookType, index: number) => (
                  <>
                    {book.image.startsWith("https://gateway.pinata.cloud") && (
                      <Grid key={index} className="">
                        <Link
                          href={{
                            pathname: `/admin/books/image/${book.title}?booksCategory=${booksCategory}`,
                            query: {
                              title: book.title,
                              author: book.author,
                              category: book.category,
                              totalCopies: book.totalCopies,
                              availableCopies: book.availableCopies,
                              price: book.price,
                              image: book.image,
                            },
                          }}
                        >
                          <>
                            <img
                              width={200}
                              height={200}
                              src={book.image}
                              alt={book.title}
                              style={{ maxHeight: "200px", maxWidth: "150px" }}
                              className="  hover:scale-105 hover:shadow-lg hover:shadow-[var(--secondary)] rounded-3xl transition-all duration-300 ease-in-out"
                            />
                          </>
                        </Link>
                      </Grid>
                    )}
                  </>
                ))}
              </Grid>
            </Fade>
          )}
        </div>
      </div>
    </Suspense>
  )
}

function ButtonRow({ handleOpen, booksCategory }: { handleOpen: any; booksCategory: string }) {
  return (
    <div className="mt-6 lg:px-16 px-4 flex  lg:flex-nowrap flex-wrap items-center justify-between">
      <div className=" space-x-2  flex    w-full   items-center">
        {["all", "primary", "secondary", "university"].map((category) => (
          <div className=" flex   items-start  ">
            <Link key={category} href={{ query: { booksCategory: category } }}>
              <button
                className={`${
                  booksCategory === category
                    ? "text-[var(--secondary)] border-[var(--secondary)]"
                    : "text-[var(--gary)] border-[var(--gary)]"
                } px-4  text-sm py-[0.3rem] rounded-lg font-semibold border-2 transition-all duration-300 ease-in-out`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            </Link>
          </div>
        ))}
      </div>

      <div className="w-full justify-end flex lg:mt-0 mt-4">
        <button
          onClick={handleOpen}
          className="bg-[var(--secondary)]  text-sm group hover:bg-white border-2 border-transparent hover:text-[var(--secondary)] hover:border-[var(--secondary)] duration-300 ease-in-out transition-all text-white font-bold rounded-lg px-4 py-[0.4rem] flex items-center"
        >
          <AddIcon
            sx={{ color: "white", mr: "6px" }}
            className="   group-hover:text-[var(--secondary)]  duration-300 ease-in-out transition-all"
          />
          Add Book
        </button>
      </div>
    </div>
  )
}
