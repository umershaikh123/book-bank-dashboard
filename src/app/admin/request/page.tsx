"use client"
import Header from "@/app/components/Header"
export default function Page() {
  return (
    <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
      <Header page={"Request"} searchBarToggle={false} />
    </div>
  )
}
