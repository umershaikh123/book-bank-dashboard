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
  )
}

export default SearchBar
