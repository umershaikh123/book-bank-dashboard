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

      <div className="lg:ml-[15rem] ml-0 lg:max-w-[85vw] max-w-[100vw] overflow-hidden ">{children}</div>
    </div>
  )
}

export default layout
