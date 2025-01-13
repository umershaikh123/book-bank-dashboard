import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"

import { booksTable } from "@/db/schema"

import { z } from "zod"
const db = drizzle(process.env.DATABASE_URL || "")
// Define Zod validation schema for the UPDATE request
const updateBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string(),
  category: z.string(),
  totalCopies: z.number(),
  availableCopies: z.number(),
  price: z.number(),
  image: z.string(),
})

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Parse the incoming request body
    const body = await req.json()
    console.log("body", body)
    const parsedData = updateBookSchema.safeParse(body)
    console.log("parsedData", parsedData)
    if (!parsedData.success) {
      // If validation fails, return an error response
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { title, ...updateFields } = parsedData.data

    // Perform update using Drizzle ORM
    const result = await db.update(booksTable).set(updateFields).where(eq(booksTable.title, title)).execute()
    console.log("result", result)

    return NextResponse.json({ success: true, message: "Book updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error updating book:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
