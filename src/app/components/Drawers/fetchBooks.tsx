import { BookType } from "@/app/lib/Books/fetcher"

export const fetchBooks = async (bookHistory: { book_title: string; return_date: string; borrowed_status: string }[]) => {
  if (!bookHistory || bookHistory.length === 0) return []

  const token = localStorage.getItem("auth_token")
  const titles = bookHistory.map((book) => book.book_title).join(",")
  const response = await fetch(`/api/database/books/select/where?titles=${encodeURIComponent(titles)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch books")
  }

  const fetchedBooks = await response.json()

  // Combine fetched books with return_date and borrowed_status from bookHistory
  return bookHistory.map((historyItem) => {
    const bookDetails = fetchedBooks.data.find((book: BookType) => book.title === historyItem.book_title)
    return {
      ...historyItem,
      ...bookDetails,
    }
  })
}
