"use client" // Enable client-side interactivity
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    })

    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Dashboard</h1>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  )
}
