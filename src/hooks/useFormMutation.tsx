"use client"

import { useMutation } from "@tanstack/react-query"

export function useUpdateFormStatus() {
  return useMutation({
    mutationFn: async ({ form_number, request_status }: { form_number: number; request_status: string }) => {
      const token = localStorage.getItem("auth_token")

      const response = await fetch("/api/database/forms/update/requestStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ form_number, request_status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Failed to update form:", errorData)
        throw new Error(errorData.error || "Failed to update form")
      }

      return response.json()
    },
  })
}

export function useUpdateBorrowedStatus() {
  return useMutation({
    mutationFn: async ({ form_number, borrowed_status }: { form_number: number; borrowed_status: string }) => {
      const token = localStorage.getItem("auth_token")

      const response = await fetch("/api/database/forms/update/BorrowedStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ form_number, borrowed_status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Failed to update form:", errorData)
        throw new Error(errorData.error || "Failed to update form")
      }

      return response.json()
    },
  })
}
