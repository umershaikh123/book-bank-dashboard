import { NextResponse } from "next/server"
import { drizzle } from "drizzle-orm/neon-serverless"

import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"
import { bookRequestsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

const deleteBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
})

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()
    console.log("Request body:", body)

    const parsedData = deleteBookSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { title } = parsedData.data
    await db.delete(bookRequestsTable).where(eq(bookRequestsTable.book_title, title)).execute()

    return NextResponse.json({ success: true, message: "Book deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error deleting book:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
