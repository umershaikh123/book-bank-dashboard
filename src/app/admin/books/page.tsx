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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queryClient } from "@/utils/Provider"
import { toast } from "react-toastify"
import Lottie from "lottie-react"
import { Fade } from "@mui/material"
// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"

import { useInView } from "react-intersection-observer"

const LoadingSpinner = React.memo(() => (
  <div className="justify-center items-center h-[60vh] w-full flex">
    <div className="loader"></div>
  </div>
))

const EmptyState = React.memo(() => (
  <div className="justify-center items-center h-[60vh] w-full flex flex-col">
    <Lottie style={{ height: 600, width: 600 }} animationData={notFoundAnimation} loop={true} />
    <h1 className="text-3xl font-bold text-gray-300">Data not Found</h1>
  </div>
))

export default function Page() {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const searchParams = useSearchParams()
  const booksCategory = searchParams.get("booksCategory")
  const queryClient = useQueryClient()

  // Prefetch the next category data
  React.useEffect(() => {
    // Assuming you have some predictable categories or navigation patterns
    const categories = ["all", "fiction", "non-fiction", "science"]
    const currentIndex = categories.indexOf(booksCategory || "all")

    if (currentIndex !== -1) {
      // Prefetch the next category
      const nextCategory = categories[(currentIndex + 1) % categories.length]
      queryClient.prefetchQuery({
        queryKey: ["books", nextCategory],
        queryFn: async () => await fetchBooks(nextCategory),
      })
    }
  }, [booksCategory, queryClient])

  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books", booksCategory],
    queryFn: async () => await fetchBooks(booksCategory || "all"),
    refetchOnWindowFocus: false,
    enabled: !!booksCategory,
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
  })

  if (isError) {
    toast.error(`Error: ${error.message}`)
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="flex flex-col min-h-screen bg-white rounded-[2rem]">
        <Header page={"Books"} searchBarToggle={true} />

        <Suspense fallback={null}>
          <ButtonRow handleOpen={handleOpen} booksCategory={booksCategory || "all"} />
        </Suspense>

        <AddBookPopover open={open} handleClose={handleClose} />

        {isLoading && <LoadingSpinner />}

        {!isLoading && books?.length === 0 && <EmptyState />}

        <div className="lg:px-16 px-4 my-8">
          <OptimizedBookGrid books={books} isLoading={isLoading} booksCategory={booksCategory} />
        </div>
      </div>
    </Suspense>
  )
}

function ButtonRow({ handleOpen, booksCategory }: { handleOpen: any; booksCategory: string }) {
  return (
    <div className="mt-6 lg:px-16 px-4 flex  lg:flex-nowrap flex-wrap items-center justify-between">
      <div className=" space-x-2  flex    w-full   items-center">
        {["all", "school", "intermediate", "business"].map((category) => (
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

// Image component with lazy loading and proper sizing
// const BookImage = ({ book, booksCategory }: { book: BookType; booksCategory: string | null }) => {
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     rootMargin: "200px 0px", // Load images 200px before they come into view
//   })

//   return (
//     <div ref={ref} className="book-image-container">
//       {inView && (
//         <Link
//           href={{
//             pathname: `/admin/books/image/${book.title}`,
//             query: {
//               booksCategory,
//               title: book.title,
//               author: book.author,
//               category: book.category,
//               totalCopies: book.totalCopies,
//               availableCopies: book.availableCopies,
//               price: book.price,
//               image: book.image,
//             },
//           }}
//         >
//           <div className="relative w-[150px] h-[200px]">
//             <Image
//               src={book.image}
//               alt={book.title}
//               fill
//               sizes="150px"
//               priority={false}
//               placeholder="blur"
//               blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU4Ii8+PC9zdmc+"
//               className="rounded-3xl hover:scale-105 hover:shadow-lg hover:shadow-[var(--secondary)] transition-all duration-300 ease-in-out object-cover"
//             />
//           </div>
//         </Link>
//       )}
//     </div>
//   )
// }

const getIpfsHash = (url: string): string => {
  if (!url || !url.startsWith("https://gateway.pinata.cloud/ipfs/")) {
    return ""
  }
  return url.replace("https://gateway.pinata.cloud/ipfs/", "")
}

// Helper to transform IPFS URLs to our proxy
const getProxiedImageUrl = (originalUrl: string): string => {
  if (!originalUrl || !originalUrl.startsWith("https://gateway.pinata.cloud/ipfs/")) {
    return originalUrl
  }

  const hash = getIpfsHash(originalUrl)
  return `/api/ipfs-proxy?hash=${hash}`
}

// Image component with error handling and fallback
const BookImage = ({
  book,
  booksCategory,
  priority = false,
}: {
  book: BookType
  booksCategory: string | null
  priority?: boolean
}) => {
  const [imageError, setImageError] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  })

  const imageUrl = imageError ? "/Images/image8.svg" : getProxiedImageUrl(book.image)

  return (
    <div ref={ref} className="book-image-container">
      {inView && (
        <Link
          href={{
            pathname: `/admin/books/image/${book.title}`,
            query: {
              booksCategory,
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
          <div className="relative w-[150px] h-[200px]">
            <Image
              src={imageUrl}
              alt={book.title}
              fill
              sizes="150px"
              priority={priority}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU4Ii8+PC9zdmc+"
              className="rounded-3xl hover:scale-105 hover:shadow-lg hover:shadow-[var(--secondary)] transition-all duration-300 ease-in-out object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        </Link>
      )}
    </div>
  )
}

const OptimizedBookGrid = ({
  books,
  isLoading,
  booksCategory,
}: {
  books: BookType[] | undefined
  isLoading: boolean
  booksCategory: string | null
}) => {
  if (isLoading || !books) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {books
        .filter((book) => book.image?.startsWith("https://gateway.pinata.cloud/ipfs/"))
        .map((book, index) => (
          <div key={`book-${book.title}-${index}`} className="flex justify-center">
            <BookImage
              book={book}
              booksCategory={booksCategory}
              priority={index < 8} // Priority loading for first 8 images
            />
          </div>
        ))}
    </div>
  )
}
// Virtualized grid that only renders what's needed
// const OptimizedBookGrid = ({
//   books,
//   isLoading,
//   booksCategory,
// }: {
//   books: BookType[] | undefined
//   isLoading: boolean
//   booksCategory: string | null
// }) => {
//   if (isLoading || !books) return null

//   return (
//     <Fade in={true} timeout={300}>
//       <Grid container spacing={4} direction="row" className="w-full" sx={{ justifyContent: "start", alignItems: "center" }}>
//         {books
//           .filter((book) => book.image.startsWith("https://gateway.pinata.cloud"))
//           .map((book, index) => (
//             <Grid key={`book-${book.title}-${index}`}>
//               <BookImage book={book} booksCategory={booksCategory} />
//             </Grid>
//           ))}
//       </Grid>
//     </Fade>
//   )
// }

// export default function Page() {
//   const [open, setOpen] = React.useState(false)
//   const handleOpen = () => setOpen(true)
//   const handleClose = () => setOpen(false)
//   const searchParams = useSearchParams()
//   const booksCategory = searchParams.get("booksCategory")

//   const {
//     data: books,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["books", booksCategory],
//     queryFn: async () => await fetchBooks(booksCategory || "all"),
//     refetchOnWindowFocus: false,
//     enabled: !!booksCategory,
//   })

//   if (isError) {
//     toast.error(`Error: ${error.message}`)
//   }

//   return (
//     <Suspense
//       fallback={
//         <div className="justify-center items-center h-[60vh]  w-full flex">
//           <div className="loader"></div>
//         </div>
//       }
//     >
//       <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
//         <Header page={"Books"} searchBarToggle={true} />
//         <Suspense>
//           <ButtonRow handleOpen={handleOpen} booksCategory={booksCategory || "all"} />
//         </Suspense>

//         <AddBookPopover open={open} handleClose={handleClose} />

//         {isLoading && (
//           <div className="justify-center items-center h-[60vh]  w-full flex">
//             <div className="loader"></div>
//           </div>
//         )}

//         {!isLoading && books?.length === 0 && (
//           <div className="justify-center items-center h-[60vh]  w-full flex flex-col">
//             <Lottie style={{ height: 600, width: 600 }} animationData={notFoundAnimation} loop={true} />

//             <h1 className="text-3xl font-bold text-gray-300">Data not Found</h1>
//           </div>
//         )}

//         <div className="lg:px-16 px-4 my-8  ">
//           {!isLoading && !isError && books && (
//             <Fade in={true} timeout={300}>
//               <Grid
//                 container
//                 spacing={4}
//                 direction="row"
//                 className="w-full"
//                 sx={{ justifyContent: "start", alignItems: "center" }}
//               >
//                 {books.map((book: BookType, index: number) => (
//                   <>
//                     {book.image.startsWith("https://gateway.pinata.cloud") && (
//                       <Grid key={index} className="">
//                         <Link
//                           href={{
//                             pathname: `/admin/books/image/${book.title}?booksCategory=${booksCategory}`,
//                             query: {
//                               title: book.title,
//                               author: book.author,
//                               category: book.category,
//                               totalCopies: book.totalCopies,
//                               availableCopies: book.availableCopies,
//                               price: book.price,
//                               image: book.image,
//                             },
//                           }}
//                         >
//                           <>
//                             <Image
//                               width={200}
//                               height={200}
//                               src={book.image}
//                               alt={book.title}
//                               style={{ maxHeight: "200px", maxWidth: "150px" }}
//                               className="  hover:scale-105 hover:shadow-lg hover:shadow-[var(--secondary)] rounded-3xl transition-all duration-300 ease-in-out"
//                             />
//                           </>
//                         </Link>
//                       </Grid>
//                     )}
//                   </>
//                 ))}
//               </Grid>
//             </Fade>
//           )}
//         </div>
//       </div>
//     </Suspense>
//   )
// }
