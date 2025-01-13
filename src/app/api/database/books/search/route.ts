import { NextResponse } from "next/server"

import { like } from "drizzle-orm"
import { z } from "zod"
import { drizzle } from "drizzle-orm/neon-serverless"

import { booksTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")
// Define Zod schema for search query validation
const searchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required"),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")

    const parsedQuery = searchQuerySchema.safeParse({ query })
    if (!parsedQuery.success) {
      return NextResponse.json({ success: false, error: parsedQuery.error.errors }, { status: 400 })
    }

    // Fetch books matching the search query
    const books = await db
      .select()
      .from(booksTable)
      .where(like(booksTable.title, `%${parsedQuery.data.query}%`))
      .execute()

    return NextResponse.json({ success: true, books }, { status: 200 })
  } catch (err) {
    console.error("Error fetching search results:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
