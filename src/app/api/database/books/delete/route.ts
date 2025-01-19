import { NextResponse } from "next/server"
import { drizzle } from "drizzle-orm/neon-serverless"

import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"
import { booksTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

// Define Zod validation schema for the DELETE request
const deleteBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
})

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

    // Use Drizzle ORM to delete the book by title
    const result = await db.delete(booksTable).where(eq(booksTable.title, title)).execute()
    console.log("result", result)

    return NextResponse.json({ success: true, message: "Book deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error deleting book:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
