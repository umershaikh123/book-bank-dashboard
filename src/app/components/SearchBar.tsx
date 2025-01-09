import React, { useState } from "react"
import { Search } from "@mui/icons-material"

interface SearchBarProps {
  placeholder?: string
  onChange?: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search", onChange }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-2 text-gray-400" />
      <input
        type="text"
        className="w-full px-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default SearchBar
