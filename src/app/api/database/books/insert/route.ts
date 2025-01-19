import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  totalCopies: z.number().min(1, "Total copies must be at least 1"),
  availableCopies: z.number().min(0, "Available copies cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
  image: z.string().url("Image URL must be a valid URL"),
})

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Parse request body
    const body = await req.json()

    // Validate incoming data using Zod
    const parsedData = bookSchema.safeParse(body)

    if (!parsedData.success) {
      console.log("failed to parse data", parsedData.error.errors)
      // If validation fails, return an error response
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { title, author, category, totalCopies, availableCopies, price, image } = parsedData.data

    // Insert the validated book into the database
    await sql`
      INSERT INTO books (title, author, category, total_copies, available_copies, price, image)
      VALUES (${title}, ${author}, ${category}, ${totalCopies}, ${availableCopies}, ${price}, ${image})
    `

    return NextResponse.json({ success: true, message: "Book inserted successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
