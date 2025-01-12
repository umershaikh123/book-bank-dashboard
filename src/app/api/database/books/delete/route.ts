import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"

// Define Zod validation schema for the DELETE request
const deleteBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
})

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function DELETE(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Parse the incoming request body
    const body = await req.json()

    // Validate the incoming data using Zod
    const parsedData = deleteBookSchema.safeParse(body)

    if (!parsedData.success) {
      // If validation fails, return an error response
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { title } = parsedData.data

    // Delete the book from the database using the title
    const result = await sql`
      DELETE FROM books WHERE title = ${title}
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Book deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
