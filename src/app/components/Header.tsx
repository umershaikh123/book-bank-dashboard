import React from "react"

import SearchBar from "@/app/components/SearchBar"
const Header = ({ page, searchBarToggle }: { page: string; searchBarToggle: boolean }) => {
  return (
    <div className=" bg-[var(--secondary)] w-full flex relative px-16 py-6  rounded-tl-[2rem] ">
      <h1 className="text-3xl font-bold text-white">{page}</h1>

      {searchBarToggle && (
        <div className="absolute top-5   xl:left-[25rem] lg:left-[20rem] lg:max-w-[20rem] left-[15rem] w-full xl:max-w-[30rem] max-w-[15rem]   ">
          <SearchBar placeholder="Search..." onChange={(value) => console.log(value)} />
        </div>
      )}
    </div>
  )
}

export default Header
