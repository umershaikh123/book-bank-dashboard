import { NextResponse } from "next/server"
import { like, or } from "drizzle-orm"
import { z } from "zod"
import { drizzle } from "drizzle-orm/neon-serverless"

import { booksTable } from "@/db/schema"

const db = drizzle(process.env.DATABASE_URL || "")

// Define Zod schema for search query validation
const searchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required"),
})

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Extract search query from the request URL
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")

    // Validate the query using Zod
    const parsedQuery = searchQuerySchema.safeParse({ query })
    if (!parsedQuery.success) {
      return NextResponse.json({ success: false, error: parsedQuery.error.errors }, { status: 400 })
    }

    const searchQuery = `%${parsedQuery.data.query}%`

    // Perform the database search with OR conditions for title, author, category,
    const books = await db
      .select()
      .from(booksTable)
      .where(
        or(like(booksTable.title, searchQuery), like(booksTable.author, searchQuery), like(booksTable.category, searchQuery))
      )
      .execute()

    return NextResponse.json({ success: true, books }, { status: 200 })
  } catch (err) {
    console.error("Error fetching search results:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
