import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { drizzle } from "drizzle-orm/neon-serverless"
import { neon, neonConfig } from "@neondatabase/serverless"
import { booksTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("booksCategory")

    // Select books by category
    if (category && category !== "all") {
      const books = await db.select().from(booksTable).where(eq(booksTable.category, category))
      console.log("Filtered by category:", books)

      return NextResponse.json({ success: true, data: books }, { status: 200 })
    }

    // Select all books
    const books = await db.select().from(booksTable)
    console.log("All books:", books)

    return NextResponse.json({ success: true, data: books }, { status: 200 })
  } catch (err: any) {
    console.error("Error fetching books:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
