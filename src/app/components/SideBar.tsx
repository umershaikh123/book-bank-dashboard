"use client"

import React from "react"
import bookIcon from "/public/Images/sidebar/books.svg"
import requestIcon from "/public/Images/sidebar/request.svg"
import monitoringIcon from "/public/Images/sidebar/monitoring.svg"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { usePathname } from "next/navigation"
import { toast } from "react-toastify"
const SideBar = () => {
  const path = usePathname()
  const router = useRouter()
  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    })
    localStorage.removeItem("auth_token")
    toast.info("Logging Out")
    router.push("/login")
  }
  return (
    <div className="  h-screen w-[15rem] flex flex-col items-start pl-8 justify-between py-8  fixed text-[var(--secondary)] font-semibold  bg-[var(--background)]">
      <div className="">
        <h1 className="text-4xl  font-bold">Book Bank</h1>
      </div>
      <div className="flex flex-col space-y-10 pb-32 ">
        <Link href={"/admin/books?booksCategory=all"} className="flex items-center space-x-2 ">
          <Image src={bookIcon} width={35} height={35} alt={`Books icon`} />

          <div className="flex flex-col">
            <div className="text-xl flex -mb-1 hover:text-2xl transition-all duration-150 ease-in"> Books </div>
            <div
              className={`${
                path.startsWith("/admin/books") ? "opacity-100" : "opacity-0"
              }  bg-[var(--secondary)] transition-all duration-150 h-1 mt-1 `}
            ></div>
          </div>
        </Link>

        <Link href={"/admin/request?formStatus=Pending"} className="flex items-center space-x-2  ">
          <Image src={requestIcon} width={35} height={35} alt={`requestIcon `} className="-mt-1" />
          <div className="flex flex-col">
            <div className="text-xl flex -mb-1 hover:text-2xl transition-all duration-150 ease-in"> Request </div>
            <div
              className={`${
                path === "/admin/request" ? "opacity-100" : "opacity-0"
              }  bg-[var(--secondary)] transition-all duration-300 h-1 mt-1`}
            ></div>
          </div>
        </Link>

        <Link href={"/admin/monitor"} className="flex items-center space-x-2  ">
          <Image src={monitoringIcon} width={35} height={35} alt={`monitoringIcon`} className="-mt-3" />
          <div className="flex flex-col">
            <div className="text-xl flex -mb-2 hover:text-2xl transition-all duration-150 ease-in"> Monitor </div>
            <div
              className={`${
                path === "/admin/monitor" ? "opacity-100" : "opacity-0"
              }  bg-[var(--secondary)] transition-all duration-150 h-1 mt-2`}
            ></div>
          </div>
        </Link>
      </div>
      <div className=" pb-8 relative ">
        <button className="logoutBtn">
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>

          <div className="textButton" onClick={handleLogout}>
            Logout
          </div>
        </button>
      </div>
    </div>
  )
}

export default SideBar
