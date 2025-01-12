"use client"

import { useState } from "react"
import Lottie from "lottie-react"
import { useMutation } from "@tanstack/react-query"
// @ts-ignore
import booksAnimation from "/public/animations/books.json"
import logo from "/public/Images/logo.svg"
import Image from "next/image"
import VpnKeyIcon from "@mui/icons-material/VpnKey"

import IconButton from "@mui/material/IconButton"

import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import InputAdornment from "@mui/material/InputAdornment"

import FormControl from "@mui/material/FormControl"

import PersonIcon from "@mui/icons-material/Person"

import { toast } from "react-toastify"

const login = async (credentials: { username: string; password: string }) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Invalid credentials")
  }

  const data = await response.json()

  return data.token
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (token: string) => {
      // Store the JWT token securely
      localStorage.setItem("auth_token", token)
      console.log("Login Successful")
      toast.info("Login Successful")

      window.location.href = "/admin/books?booksCategory=all"
    },
    onError: (error: any) => {
      console.log("Login failed", error.message)
      toast.error(error.message || "Login failed")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const credentials = { username, password }
    mutation.mutate(credentials)
  }

  return (
    <div className="flex items-center justify-betweenh-screen bg-[var(--primary)] w-full overflow-y-clip">
      <div className="w-1/2 flex  items-center justify-between    h-screen flex-col border-r-2 border-[var(--secondary)]">
        <div className="flex w-full justify-center text-center flex-col items-center space-y-3 mt-10">
          <h1 className="text-6xl text-[var(--secondary)] font-semibold">Book Bank</h1>
          <h1 className="text-xl text-[var(--secondary)] font-semibold">Admin dashboard for ICC book bank</h1>
        </div>

        <div className=" -mt-10   ">
          <Lottie style={{ height: 600, width: 600 }} animationData={booksAnimation} loop={true} />
        </div>
      </div>

      <div className="w-1/2 flex bg-white  items-center h-screen flex-col  pt-8 ">
        <Image src={logo} width={300} height={300} alt="ICC logo" />

        <form onSubmit={handleSubmit} className="flex flex-col space-y-8 py-8  before: ">
          <FormControl sx={{ width: "20rem" }} variant="outlined">
            <InputLabel htmlFor="outlined-username">Username</InputLabel>
            <OutlinedInput
              id="outlined-username"
              type={"text"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="start">
                  <IconButton>
                    <PersonIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Username"
            />
          </FormControl>
          <FormControl sx={{ width: "20rem" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="start">
                  <IconButton>
                    <VpnKeyIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <button
            type="submit"
            className=" bg-[var(--secondary)] px-8 py-2 w-80 rounded-lg text-white  hover:bg-[#004D74]  duration-300 ease-in-out transition-colors"
          >
            {" "}
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
