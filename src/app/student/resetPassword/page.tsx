"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isResetSuccessful, setIsResetSuccessful] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({ title: "Error", description: `Passwords do not match. Please try again`, variant: "destructive" })
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/mobile/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token || "", newPassword: password }),
      })

      const data = await res.json()

      if (data.success) {
        toast({ title: "Success", description: "Password reset successfully", variant: "default" })
        setIsResetSuccessful(true)
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
      <div className="bg-white px-8 py-8 rounded-3xl w-[20rem]">
        {isResetSuccessful ? (
          <div className="text-center">
            <h1 className="text-2xl w-full font-bold text-green-600 mb-4">Password Reset Successful</h1>
            <p className="text-sm text-gray-600">You can now log in with your new password.</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit} className="mt-8">
              <Label htmlFor="password" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your new password..."
                className="placeholder:text-xs mb-4"
              />

              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password..."
                className="placeholder:text-xs mb-2"
              />

              <Button
                type="submit"
                disabled={loading}
                className={`mt-4 w-full py-2 rounded-md focus:outline-none ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[var(--secondary)] hover:bg-[var(--secondaryHover)] text-white"
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
