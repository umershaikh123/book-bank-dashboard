import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const students = await sql`
      SELECT   name, father_name, cnic, mobile, email, address, book_history, current_borrowed,
        TotalBooksBorrowed, TotalBooksReturned, TotalNotReturnedBooks, created_at, updated_at
      FROM students
    `

    return NextResponse.json({ success: true, data: students }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
