import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"
import { jwtVerify } from "jose"
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
// Define Zod validation schema
const bookRequestSchema = z.object({
  book_title: z.string().min(1, "Book title is required"),
})

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Authorization token is missing or invalid" }, { status: 401 })
    }
    await verifyToken(authHeader || "")
    const token = authHeader.split(" ")[1]
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userEmail = payload.email
    console.log("useEmail")
    if (!userEmail) {
      return NextResponse.json({ success: false, error: "Invalid token: email not found" }, { status: 401 })
    }

    const body = await req.json()

    const parsedData = bookRequestSchema.safeParse(body)

    if (!parsedData.success) {
      console.log("failed to parse data", parsedData.error.errors)

      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { book_title } = parsedData.data

    await sql`
      INSERT INTO book_requests (book_title , email)
      VALUES (${book_title}, ${userEmail})
    `

    return NextResponse.json({ success: true, message: "Book request inserted successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
