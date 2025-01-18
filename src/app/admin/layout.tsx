import React from "react"
import SideBar from "../components/SideBar"
import { Toaster } from "@/components/ui/toaster"

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="bg-[var(--background)]">
      <SideBar />
      <Toaster />
      <div className="lg:ml-[15rem] ml-0 lg:max-w-[85vw] max-w-[100vw] overflow-hidden   ">{children}</div>
    </div>
  )
}

export default layout
