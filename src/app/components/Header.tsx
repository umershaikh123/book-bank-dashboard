import React from "react"
import { useState } from "react"
import SearchBar from "@/app/components/SearchBar"
import Link from "next/link"
import { BookType } from "../lib/Books/fetcher"
import MenuIcon from "@mui/icons-material/Menu"
import { MenuPopover } from "./Popover"
const Header = ({ page, searchBarToggle }: { page: string; searchBarToggle: boolean }) => {
  const [searchResults, setSearchResults] = useState([])
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/database/books/search?query=${query}`)
      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }
      const data = await response.json()
      setSearchResults(data.books)
    } catch (err) {
      console.error("Search error:", err)
      setSearchResults([])
    }
  }

  return (
    <div className=" bg-[var(--secondary)] w-full flex lg:justify-between justify-between relative sm:px-16 px-2 py-6 h-[5rem]  lg:rounded-tl-[2rem] ">
      <h1 className="text-3xl font-bold text-white sm:block hidden justify-start">{page}</h1>
      <MenuPopover open={open} handleClose={handleClose} />

      {searchBarToggle && (
        <div className=" flex  xl:left-[25rem] lg:left-[20rem] lg:max-w-[20rem] left-[15rem] w-full xl:max-w-[30rem] max-w-[15rem]   ">
          <SearchBar placeholder="Search..." onSearch={handleSearch} />
        </div>
      )}

      <div className=" opacity-0 sm:block hidden">hello</div>

      <div className="sm:hidden flex items-center text-white " onClick={handleOpen}>
        <MenuIcon sx={{ fontSize: "40px" }} />
      </div>

      {/* Render search results */}
      {searchBarToggle && searchResults.length > 0 && (
        <div className="absolute shadow-xl border hover:bg-slate-200 duration-300 transition-all ease-in-out border-[#ABABAB] top-[4.1rem] xl:left-[25rem] lg:left-[20rem] lg:max-w-[20rem] left-[15rem] bg-white   rounded-md p-4 w-full xl:max-w-[30rem] max-w-[15rem]">
          <ul className="grid grid-cols-1 gap-2   mt-4">
            {searchResults.map((book: BookType, index) => (
              <Link
                href={{
                  pathname: `/admin/books/image/${book.title}`,
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
                key={index}
                className="block p-4 bg-white shadow-md rounded-lg transition hover:shadow-lg hover:scale-105 duration-200 ease-in-out"
              >
                <div className="flex items-start">
                  <img
                    src={book.image}
                    alt={book.title as string}
                    className="w-[120px] h-[120px] object-cover rounded-md shadow-sm"
                  />
                  <div className="ml-4 flex flex-col">
                    <h1 className="text-lg font-bold text-gray-800">{book.title}</h1>
                    <h2 className="text-sm text-gray-500 font-semibold">{book.author}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">Price:</span> {book.price} rs
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Available:</span> {book.availableCopies}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Category:</span> {book.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Header
