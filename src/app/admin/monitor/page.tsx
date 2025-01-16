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
import { Form, columns } from "./column"

// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"
import { formatDate, calculateTimeDifference } from "@/lib/utils"
interface BookRequired {
  book_title: string
}

export interface FormData {
  book_return_date: string
  books_required: BookRequired[]
  created_at: string
  father_name: string
  mobile: string
  name: string
  form_number: number
  address: string
  borrowed_status: "borrowed" | "returned" | "NotReturned"
  request_status: "Pending" | "Approved" | "Accepted" | "Rejected"
  student_cnic: string
  updated_at: string
  timestamp: string
}

function useFetchForms(borrowed_status: "borrowed" | "returned" | "NotReturned") {
  return useQuery({
    queryKey: ["monitor form", borrowed_status],

    queryFn: async () => {
      const token = localStorage.getItem("auth_token")

      const response = await fetch(`/api/database/forms/select/borrowedStatus?borrowed_status=${borrowed_status}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log("Failed to fetched Form")
        throw new Error(errorData.error || "Failed to fetched Form")
      }
      const result = await response.json()
      console.log("response", result)
      const formattedData = result.data.map((form: FormData) => ({
        ...form,
        book_return_date: formatDate(form.book_return_date),
        created_at: formatDate(form.created_at),
        updated_at: formatDate(form.updated_at),
        timestamp: calculateTimeDifference(form.created_at),
      }))
      return formattedData.filter((form: Form) => form.borrowed_status === borrowed_status) as FormData[]
    },
    enabled: !!borrowed_status,
  })
}

export default function Page() {
  const searchParams = useSearchParams()
  const borrowed_status = searchParams.get("borrowed_status")
  const {
    data: forms,
    isLoading,
    isError,
    error,
  } = useFetchForms((borrowed_status as "borrowed" | "returned" | "NotReturned") || "borrowed")

  return (
    <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
      <Header page={"Monitor"} searchBarToggle={false} />
      <Suspense>
        <ButtonRow borrowed_status={(borrowed_status as "borrowed" | "returned" | "NotReturned") || "borrowed"} />
      </Suspense>
      <div className=" lg:container contain-none   w-full mx-auto pb-10">
        <div>
          {forms && (
            <Fade in={true} timeout={300}>
              <div>
                <h1 className="font-medium text-xl px-8 mx-4 mb-4">Monitor Table</h1>
                <DataTable columns={columns} data={forms} />
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

function ButtonRow({ borrowed_status }: { borrowed_status: "borrowed" | "returned" | "NotReturned" }) {
  return (
    <div className="mt-6 lg:px-16 px-4 flex  items-center justify-end">
      <div className="space-x-2 flex-wrap w-full justify-end flex">
        {["borrowed", "returned", "NotReturned"].map((status) => (
          <Link key={status} href={{ query: { borrowed_status: status } }}>
            <button
              className={`${
                borrowed_status === status
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
