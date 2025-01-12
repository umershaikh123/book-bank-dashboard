import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"
export async function GET(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Fetch books from the database
    const books = await sql`
      SELECT 
      *
      FROM books
    `

    return NextResponse.json({ success: true, data: books }, { status: 200 })
  } catch (err) {
    console.error("Error fetching books:", err)
    return NextResponse.json({ success: false, error: err }, { status: 401 })
  }
}
