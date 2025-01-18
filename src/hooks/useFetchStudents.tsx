import { useQuery } from "@tanstack/react-query"

export function useFetchStudents(studentStatus: string) {
  return useQuery({
    queryKey: ["students", studentStatus],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token")

      const response = await fetch(`/api/database/students/select?studentStatus=${studentStatus}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch students")
      }
      return await response.json()
    },
  })
}
