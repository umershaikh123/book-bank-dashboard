import { NextResponse } from "next/server"
import { z } from "zod"
import { drizzle } from "drizzle-orm/neon-serverless"
import { eq } from "drizzle-orm"
import { formsTable, booksTable } from "@/db/schema"
import { sql } from "drizzle-orm"
import { verifyToken } from "@/utils/verifyToken"

export async function PATCH(req: Request) {
  const db = drizzle(process.env.DATABASE_URL || "")
  try {
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")
    const body = await req.json()
    const { formId, newStatus, borrowedStatus } = body

    if (!formId || !newStatus) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    const form = await db
      .select()
      .from(formsTable)

      // .where(formsTable.id.eq(formId)).first();
      .where(eq(formsTable.form_number, formId))
      .execute()

    if (!form) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 })
    }

    // Begin transaction to update book copies and form status
    await db.transaction(async (tx) => {
      // Adjust availableCopies for rejected or returned books
      if (newStatus === "Rejected" || borrowedStatus === "returned") {
        //@ts-ignore
        for (const book of form.books_required) {
          const { book_title } = book

          await tx
            .update(booksTable)
            .set({ availableCopies: sql`${booksTable.availableCopies} - 1` })
            .where(eq(booksTable.title, book_title))
            .execute()
        }
      }

      // Update form status
      await tx
        .update(formsTable)
        .set({ request_status: newStatus, borrowed_status: borrowedStatus })
        .where(eq(formsTable.form_number, formId))
    })

    return NextResponse.json({ success: true, message: "Status updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error updating form status:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
