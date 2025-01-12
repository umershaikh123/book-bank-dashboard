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
const images = [
  "/Images/booksData/image1.svg",
  "/Images/booksData/image2.svg",
  "/Images/booksData/image3.svg",
  "/Images/booksData/image4.svg",
  "/Images/booksData/image5.svg",
  "/Images/booksData/image6.svg",
  "/Images/booksData/image7.svg",
  "/Images/booksData/image8.svg",
]

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
      <Header page={"Books"} searchBarToggle={true} />
      <Suspense>
        <ButtonRow handleOpen={handleOpen} />
      </Suspense>

      <AddBookPopover open={open} handleClose={handleClose} />

      <div className="px-16 my-8">
        <Grid
          container
          spacing={4}
          direction="row"
          sx={{
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          {images.map((imageSrc, index) => (
            <Grid key={index}>
              <Link href={`/admin/books/image/${index + 1}?booksCategory=all`}>
                <Image width={200} height={200} src={imageSrc} alt={`Image ${index + 1}`} className="" />
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}

function ButtonRow({ handleOpen }: { handleOpen: any }) {
  const searchParams = useSearchParams()
  const booksCategory = searchParams.get("booksCategory")
  return (
    <div className="mt-6 px-16   flex items-center justify-between">
      <div className=" space-x-8">
        <Link
          className=""
          href={{
            query: { booksCategory: "all" },
          }}
        >
          <button
            className={` ${
              booksCategory === "all"
                ? "text-[var(--secondary)] border-[var(--secondary)]"
                : "text-[var(--gary)] border-[var(--gary)]"
            } px-8 py-[0.3rem] rounded-lg    font-semibold  border-2  transition-all duration-300 ease-in-out`}
          >
            All
          </button>
        </Link>

        <Link
          className=""
          href={{
            query: { booksCategory: "primary" },
          }}
        >
          <button
            className={` ${
              booksCategory === "primary"
                ? "text-[var(--secondary)] border-[var(--secondary)]"
                : "text-[var(--gary)] border-[var(--gary)]"
            } px-8 py-[0.3rem] rounded-lg    font-semibold  border-2  transition-all duration-300 ease-in-out`}
          >
            Primary
          </button>
        </Link>

        <Link
          className=""
          href={{
            query: { booksCategory: "secondary" },
          }}
        >
          <button
            className={` ${
              booksCategory === "secondary"
                ? "text-[var(--secondary)] border-[var(--secondary)]"
                : "text-[var(--gary)] border-[var(--gary)]"
            } px-8 py-[0.3rem] rounded-lg    font-semibold  border-2  transition-all duration-300 ease-in-out`}
          >
            secondary
          </button>
        </Link>

        <Link
          className=""
          href={{
            query: { booksCategory: "university" },
          }}
        >
          <button
            className={` ${
              booksCategory === "university"
                ? "text-[var(--secondary)] border-[var(--secondary)]"
                : "text-[var(--gary)] border-[var(--gary)]"
            } px-8 py-[0.3rem] rounded-lg    font-semibold  border-2  transition-all duration-300 ease-in-out`}
          >
            university
          </button>
        </Link>
      </div>

      <Tippy content={`Add Book in the Database`} placement="bottom" animateFill={true} animation={"scale"} theme="translucent">
        <button
          onClick={handleOpen}
          className=" bg-[var(--secondary)] text-white font-bold rounded-lg px-4 py-2 flex items-center"
        >
          <AddIcon sx={{ color: "white", mr: "6px" }} />
          Add Book
        </button>
      </Tippy>
    </div>
  )
}
