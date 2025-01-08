import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")

export async function DELETE(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()
    const { isbn } = body

    await sql`
      DELETE FROM books WHERE isbn = ${isbn}
    `
    return NextResponse.json({ success: true, message: "Book deleted successfully" }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 401 })
  }
}
