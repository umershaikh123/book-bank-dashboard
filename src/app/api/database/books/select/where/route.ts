import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { drizzle } from "drizzle-orm/neon-serverless"

import { booksTable } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const { searchParams } = new URL(req.url)
    const titles = searchParams.get("titles")

    if (titles) {
      const titlesArray = titles.split(",") // Parse titles from query
      const books = await db.select().from(booksTable).where(inArray(booksTable.title, titlesArray)) // Match titles
      return NextResponse.json({ success: true, data: books }, { status: 200 })
    }

    return NextResponse.json({ success: false, error: "No titles provided" }, { status: 400 })
  } catch (err: any) {
    console.error("Error fetching books:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
