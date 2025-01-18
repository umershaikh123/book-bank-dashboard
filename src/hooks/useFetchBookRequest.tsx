import { useQuery } from "@tanstack/react-query"

export function useFetchBooksRequest() {
  return useQuery({
    queryKey: ["booksRequest"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/database/requestBooks/select`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch books requested")
      }
      return await response.json()
    },
  })
}
