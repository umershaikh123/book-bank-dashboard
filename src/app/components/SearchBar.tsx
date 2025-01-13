import React, { useState } from "react"
import { Search } from "@mui/icons-material"
interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-2 text-gray-400" />

      <input
        className="w-full px-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
    </div>
    // <div className="flex items-center border rounded-md bg-white">
    // <input
    //   type="text"
    //   placeholder={placeholder}
    //   value={query}
    //   onChange={handleChange}
    //   className="flex-1 px-4 py-2 focus:outline-none"
    // />
    //   <button className="px-4 py-2 bg-[var(--secondary)] text-white rounded-r-md">🔍</button>
    // </div>
  )
}

export default SearchBar

// import React, { useState } from "react"
// import { Search } from "@mui/icons-material"

// interface SearchBarProps {
//   placeholder?: string
//   onChange?: (value: string) => void
// }

// const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search", onChange }) => {
//   const [searchTerm, setSearchTerm] = useState("")

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value)
//     if (onChange) {
//       onChange(event.target.value)
//     }
//   }

//   return (
// <div className="relative">
//   <Search className="absolute left-3 top-2 text-gray-400" />
//   <input
//     type="text"
//     className="w-full px-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
//     placeholder={placeholder}
//     value={searchTerm}
//     onChange={handleInputChange}
//   />
// </div>
//   )
// }

// export default SearchBar
