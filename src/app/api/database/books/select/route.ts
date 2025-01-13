import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("booksCategory")

    if (category && category !== "all") {
      const books = await sql`
        SELECT *
        FROM books
        WHERE category =  ${category} 
      `
      console.log("category data ", books)
      return NextResponse.json({ success: true, data: books }, { status: 200 })
    } else {
      const books = await sql`
        SELECT *
        FROM books
      `
      console.log("All data ", books)
      return NextResponse.json({ success: true, data: books }, { status: 200 })
    }
  } catch (err: any) {
    console.error("Error fetching books:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 401 })
  }
}
