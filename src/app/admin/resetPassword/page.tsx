"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch("/api/mobile/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage("Password reset email sent!")
    } else {
      setMessage(data.error)
    }
  }

  return (
    <div className="flex   min-h-screen justify-center items-center bg-white rounded-[2rem] p-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <Button
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md focus:outline-none"
          >
            Send Reset Link
          </Button>
        </form>
        {message && <h1 className="mt-4 text-red-500">{message}</h1>}
      </div>

      <div>
        <ResetPassword />
      </div>
    </div>
  )
}

// Example of a simple React form for resetting password

import { useRouter, useSearchParams } from "next/navigation"

export function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [token, setToken] = useState("")
  const searchParams = useSearchParams()
  const tokenFromParams = searchParams.get("token")
  useEffect(() => {
    setToken(tokenFromParams || "")
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword: password }),
    })

    const data = await res.json()

    if (data.success) {
      setMessage("Password reset successfully!")
    } else {
      setMessage(data.error)
    }
  }

  return (
    <div className=" ml-24">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="password" className="text-sm font-medium">
          New Password
        </Label>
        <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>
        <Input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md focus:outline-none">
          Reset Password
        </Button>
      </form>
      {message && <h1 className="mt-4 text-red-500">{message}</h1>}
    </div>
  )
}
