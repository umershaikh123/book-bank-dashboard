import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"

// Define Zod validation schema for updating a book
const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  author: z.string().min(1, "Author is required").optional(),
  category: z.string().min(1, "Category is required").optional(),
  totalCopies: z.number().min(1, "Total copies must be at least 1").optional(),
  availableCopies: z.number().min(0, "Available copies cannot be negative").optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  image: z.string().url("Image URL must be a valid URL").optional(),
})

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Parse the incoming request body
    const body = await req.json()

    // Validate the incoming data using Zod
    const parsedData = updateBookSchema.safeParse(body)

    if (!parsedData.success) {
      // If validation fails, return an error response
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { title, author, category, totalCopies, availableCopies, price, image } = parsedData.data

    // Update the book in the database
    await sql`
      UPDATE books
      SET
        title = COALESCE(${title}, title),
        author = COALESCE(${author}, author),
        category = COALESCE(${category}, category),
        total_copies = COALESCE(${totalCopies}, total_copies),
        available_copies = COALESCE(${availableCopies}, available_copies),
        price = COALESCE(${price}, price),
        image = COALESCE(${image}, image),
        updated_at = NOW()
      WHERE title = ${title}
    `

    return NextResponse.json({ success: true, message: "Book updated successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
