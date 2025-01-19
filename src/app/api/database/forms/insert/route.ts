import { NextResponse } from "next/server"

import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"
import { drizzle } from "drizzle-orm/neon-serverless"
import { eq } from "drizzle-orm"
import { formsTable, booksTable } from "@/db/schema"
import { sql } from "drizzle-orm"
const db = drizzle(process.env.DATABASE_URL || "")
// Define Zod validation schema for forms
const formSchema = z.object({
  student_cnic: z.string().min(1, "cnic required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father name is required"),
  mobile: z.string().min(1, "mobile no required"),
  address: z.string().min(1, "Address is required"),
  books_required: z.array(
    z.object({
      book_title: z.string(),
    })
  ),

  book_return_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD")
    .nonempty(),
  borrowed_status: z.enum(["borrowed", "returned", "NotReturned", "not_yet"]).optional(),
  request_status: z.enum(["Pending", "Approved", "Accepted", "Rejected"]).optional(),
})

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Parse and validate the incoming request body
    const body = await req.json()
    const parsedData = formSchema.safeParse(body)

    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    // Insert the form data into the database
    const { student_cnic, name, father_name, mobile, address, books_required, book_return_date } = parsedData.data

    const bookTitles = books_required.map((book: { book_title: string }) => book.book_title)

    const books = await db
      .select({ title: booksTable.title, availableCopies: booksTable.availableCopies })
      .from(booksTable)
      .where(
        sql`${booksTable.title} IN (${sql.join(
          bookTitles.map((title) => sql.param(title)),
          sql`, `
        )})`
      )

    const unavailableBooks = books.filter((book) => book.availableCopies < 1)

    if (unavailableBooks.length > 0) {
      const unavailableTitles = unavailableBooks.map((book) => book.title).join(", ")
      return NextResponse.json(
        { success: false, error: `The following books are unavailable: ${unavailableTitles}` },
        { status: 400 }
      )
    }

    await db.transaction(async (tx) => {
      // Decrement availableCopies for required books
      for (const book of books_required) {
        const { book_title } = book

        await tx
          .update(booksTable)
          .set({ availableCopies: sql`${booksTable.availableCopies} - 1` })

          .where(eq(booksTable.title, book_title))
          .execute()
      }

      // Insert form data
      await tx.insert(formsTable).values({
        student_cnic,
        name,
        father_name,
        mobile,
        address,
        books_required,
        borrowed_status: "not_yet",
        request_status: "Pending",
        book_return_date,
      })
    })

    return NextResponse.json({ success: true, message: "Form submitted successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error inserting form:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
