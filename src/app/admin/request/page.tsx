"use client"

import React, { useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import Header from "@/app/components/Header"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import "tippy.js/animations/scale.css"
import "tippy.js/themes/translucent.css"
import Grid from "@mui/material/Grid2"
import Image from "next/image"
import { Suspense } from "react"
import { Fade } from "@mui/material"
import { fetchBooks } from "@/app/lib/Books/fetcher"
import { BookType } from "@/app/lib/Books/fetcher"
import { useQuery } from "@tanstack/react-query"
import { queryClient } from "@/utils/Provider"
import { toast } from "react-toastify"
import Lottie from "lottie-react"
// import { Fade } from "@mui/material"
import { DataTable } from "./data-table"
import { Form, columns } from "./column"

// @ts-ignore
import notFoundAnimation from "/public/animations/notFound.json"
import { formatDate, calculateTimeDifference } from "@/lib/utils"
interface BookRequired {
  book_title: string
}

export interface FormData {
  address: string
  book_return_date: string
  books_required: BookRequired[]
  borrowed_status: string
  created_at: string
  father_name: string
  form_number: number
  mobile: string
  name: string
  request_status: "Pending" | "Approved" | "Accepted" | "Rejected"
  student_cnic: string
  updated_at: string
  timestamp: string
}

function useFetchForms(formStatus: string) {
  return useQuery({
    queryKey: ["forms", formStatus],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token")

      const response = await fetch(`/api/database/forms/select?formStatus=${formStatus}`, {
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
      return formattedData.filter((form: Form) => form.request_status === formStatus) as FormData[]
    },
  })
}

export default function Page() {
  const searchParams = useSearchParams()
  const formStatus = searchParams.get("formStatus")
  const { data: forms, isLoading, isError, error } = useFetchForms(formStatus || "Pending")

  return (
    <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
      <Header page={"Request"} searchBarToggle={false} />
      <Suspense>
        <ButtonRow formStatus={formStatus || "Pending"} />
      </Suspense>
      <div className="container mx-auto py-10">
        <div>
          {forms && (
            <Fade in={true} timeout={300}>
              <div>
                <h1 className="font-medium text-xl px-8 mx-4 mb-4">Requests Table</h1>
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

      {isError ||
        (!isLoading && forms?.length === 0 && (
          <div className="justify-center items-center h-fit w-full flex flex-col">
            <Lottie style={{ height: 200, width: 200 }} animationData={notFoundAnimation} loop={true} />

            <h1 className="text-xl font-bold text-gray-300">Data not Found</h1>
          </div>
        ))}
    </div>
  )
}

function ButtonRow({ formStatus }: { formStatus: string }) {
  return (
    <div className="mt-6 px-16 flex items-center justify-end">
      <div className="space-x-2">
        {["Pending", "Approved", "Accepted", "Rejected"].map((status) => (
          <Link key={status} href={{ query: { formStatus: status } }}>
            <button
              className={`${
                formStatus === status
                  ? "text-[var(--secondary)] border-[var(--secondary)]"
                  : "text-[var(--gary)] border-[var(--gary)]"
              } px-8 py-[0.3rem] rounded-lg font-semibold border-2 transition-all duration-300 ease-in-out text-sm`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}
