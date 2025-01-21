"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
  const [email, setEmail] = useState("")

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/mobile/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (data.success) {
        toast({ title: "Success", description: "Password reset email sent successfully", variant: "default" })
      } else {
        toast({ title: "Error", description: `${data.error}`, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again later.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-[var(--primary)] rounded-[2rem] p-8">
      <div className="bg-white px-8 py-8 rounded-3xl w-[20rem] h-[15rem]  ">
        <h1 className="text-xl font-medium w-full text-center mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="email" className="text-sm font-medium ">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email..."
            className=" placeholder:text-xs mt-2"
          />

          <Button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-2 rounded-md focus:outline-none ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[var(--secondary)] hover:bg-[var(--secondaryHover)] text-white"
            }`}
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  )
}
