import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"

// Define Zod validation schema
const bookRequestSchema = z.object({
  book_title: z.string().min(1, "Book title is required"),
})

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()

    const parsedData = bookRequestSchema.safeParse(body)

    if (!parsedData.success) {
      console.log("failed to parse data", parsedData.error.errors)

      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { book_title } = parsedData.data

    await sql`
      INSERT INTO book_requests (book_title)
      VALUES (${book_title})
    `

    return NextResponse.json({ success: true, message: "Book request inserted successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
