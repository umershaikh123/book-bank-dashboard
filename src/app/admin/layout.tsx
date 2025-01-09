import React from "react"
import SideBar from "../components/SideBar"

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="bg-[var(--background)]">
      <SideBar />

      <div className="ml-[15rem] max-w-[85vw] ">{children}</div>
    </div>
  )
}

export default layout
