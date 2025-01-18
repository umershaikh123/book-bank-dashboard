"use client"

import React, { useState } from "react"
import Header from "@/app/components/Header"
import Link from "next/link"

import { Fade } from "@mui/material"

import { DataTable } from "./data-table"
import { columns } from "./column"

import { useFetchBooksRequest } from "@/hooks/useFetchBookRequest"
export default function Page() {
  const { data: bookRequestData, isLoading, isError } = useFetchBooksRequest()

  if (isError) {
    console.log("error ", isError)
  }
  return (
    <div className="flex flex-col   min-h-screen bg-white rounded-[2rem]   ">
      <Header page={"Book Request"} searchBarToggle={false} />

      <div className=" lg:container contain-none   w-full mx-auto pb-10 mt-16">
        <div>
          {bookRequestData && (
            <Fade in={true} timeout={300}>
              <div>
                <h1 className="font-medium text-xl px-8 mx-4 mb-4">Book Request Table</h1>
                <DataTable columns={columns} data={bookRequestData.data} />
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
