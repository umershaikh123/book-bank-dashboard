import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")

export async function PUT(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()
    const { isbn, title, author } = body

    await sql`
      UPDATE books
      SET title = ${title}, author = ${author}, updated_at = NOW()
      WHERE isbn = ${isbn}
    `
    return NextResponse.json({ success: true, message: "Book updated successfully" }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 401 })
  }
}
