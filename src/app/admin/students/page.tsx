"use client"

import React, { useState } from "react"
import Header from "@/app/components/Header"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import "tippy.js/dist/tippy.css"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"
import { Suspense } from "react"
import { Fade } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import Lottie from "lottie-react"
import { DataTable } from "./data-table"
import { StudentType, columns } from "./column"

// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"
import { formatDate, calculateTimeDifference } from "@/lib/utils"

import { useFetchStudents } from "@/hooks/useFetchStudents"

export default function Page() {
  const searchParams = useSearchParams()
  const studentStatus = searchParams.get("studentStatus") || "whiteListed"
  const { data: studentsData, isLoading, isError } = useFetchStudents(studentStatus)

  return (
    <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
      <Header page={"Students"} searchBarToggle={false} />
      <Suspense>
        <ButtonRow studentStatus={studentStatus || "whiteListed"} />
      </Suspense>
      <div className=" lg:container contain-none   w-full mx-auto pb-10">
        <div>
          {studentsData && (
            <Fade in={true} timeout={300}>
              <div>
                <h1 className="font-medium text-xl px-8 mx-4 mb-4">Students Table</h1>
                <DataTable columns={columns} data={studentsData} />
              </div>
            </Fade>
          )}
        </div>
      </div>
      {isLoading && (
        <div className="justify-center items-center h-[60vh]  w-full flex">
          <div className="loader"></div>
        </div>
      )}
    </div>
  )
}

function ButtonRow({ studentStatus }: { studentStatus: string }) {
  return (
    <div className="mt-6 lg:px-16 px-4 flex  items-center justify-end">
      <div className="space-x-2 flex-wrap w-full justify-end flex">
        {["whiteListed", "BlackListed"].map((status) => (
          <Link key={status} href={{ query: { studentStatus: status } }}>
            <button
              className={`${
                studentStatus === status
                  ? "text-[var(--secondary)] border-[var(--secondary)]"
                  : "text-[var(--gary)] border-[var(--gary)]"
              } px-4  text-sm py-[0.3rem] rounded-lg font-semibold border-2 transition-all duration-300 ease-in-out  `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}
