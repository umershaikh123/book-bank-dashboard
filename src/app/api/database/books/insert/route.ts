import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"
export async function POST(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()
    const { isbn, title, author, category, totalCopies, availableCopies, price, subject, gradeLevel, image } = body

    await sql`
      INSERT INTO books (isbn, title, author, category, total_copies, available_copies, price, subject, grade_level, image)
      VALUES (${isbn}, ${title}, ${author}, ${category}, ${totalCopies}, ${availableCopies}, ${price}, ${subject}, ${gradeLevel}, ${image})
    `
    return NextResponse.json({ success: true, message: "Book inserted successfully" }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 401 })
  }
}
