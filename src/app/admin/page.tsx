"use client" // Enable client-side interactivity
import { useRouter } from "next/navigation"

import { useQuery } from "@tanstack/react-query"

async function fetchUsers() {
  const response = await fetch("/api/database", {
    method: "GET",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  const data = await response.json()
  return data.data
}

async function postUsers() {
  const response = await fetch("/api/database", {
    method: "POST",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }
  const data = await response.json()
  console.log("data", data)
  return
}
export default function AdminDashboard() {
  const router = useRouter()

  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  if (isLoading) return <div>Loading...</div>
  if (error instanceof Error) return <div>Error: {error.message}</div>
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

      <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Users List</h1>
        <ul className="bg-white shadow rounded w-full p-4">
          {data?.map((user: { id: number; name: string }) => (
            <li key={user.id} className="p-2 border-b last:border-b-0">
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
