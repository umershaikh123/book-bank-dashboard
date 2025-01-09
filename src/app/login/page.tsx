"use client"

import { useState } from "react"
import Lottie from "lottie-react"
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
export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    console.log("data", data)
    if (res.ok) {
      window.location.href = "/admin"
      toast.info("Login Successful")
    } else {
      toast.error(`${data.message}`)
    }
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

// export default function LoginPage() {
//   const [username, setUsername] = useState("")
//   const [password, setPassword] = useState("")
//   const [errorv, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const res = await fetch("/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     })

//     const data = await res.json()
//     console.log("data", data)
//     if (res.ok) {
//       window.location.href = "/admin"
//     } else {
//       setError(data.message || "Login failed")
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Username</label>
//           <input
//             type="text"
//             className="w-full px-3 py-2 border rounded-lg"
// value={username}
// onChange={(e) => setUsername(e.target.value)}
// required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-2">Password</label>
//           <input
//             type="password"
//             className="w-full px-3 py-2 border rounded-lg"
// value={password}
// onChange={(e) => setPassword(e.target.value)}
// required
//           />
//         </div>
//         <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
//           Login
//         </button>
//       </form>
//     </div>
//   )
// }
