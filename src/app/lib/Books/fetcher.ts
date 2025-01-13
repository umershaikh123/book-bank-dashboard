"use client"

export type BookType = {
  title: string
  author: string
  category: string
  totalCopies: number
  availableCopies: number
  price: string
  image: string
  created_at: string
  updated_at: string
}

export const fetchBooks = async (booksCategory: string): Promise<BookType[]> => {
  const token = localStorage.getItem("auth_token")
  const response = await fetch(`/api/database/books/select?booksCategory=${booksCategory}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to fetch books")
  }

  const data = await response.json()
  return data.data
}
