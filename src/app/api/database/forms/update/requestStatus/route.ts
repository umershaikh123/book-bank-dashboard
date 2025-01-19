import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { sql } from "drizzle-orm"
import { formsTable, booksTable } from "@/db/schema"
import { z } from "zod"

const db = drizzle(process.env.DATABASE_URL || "")

const updateFormSchema = z.object({
  form_number: z.number().min(1, "Form number is required"),
  request_status: z.enum(["Pending", "Approved", "Accepted", "Rejected"]),
})

export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()
    console.log("body ", body)
    const parsedData = updateFormSchema.safeParse(body)

    if (!parsedData.success) {
      console.log("parsedData.error.errors", parsedData.error.errors)
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { form_number, request_status } = parsedData.data

    const form = await db.select().from(formsTable).where(eq(formsTable.form_number, form_number)).execute()

    if (!form.length) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 })
    }

    const formData = form[0]

    await db.transaction(async (tx) => {
      if (request_status === "Accepted") {
        const borrowed_status = "borrowed"
        await tx
          .update(formsTable)
          .set({ request_status, borrowed_status })
          .where(eq(formsTable.form_number, form_number))
          .execute()
        return NextResponse.json({ success: true, message: "Form updated successfully" }, { status: 200 })
      }

      // If request_status is "Rejected", update availableCopies
      if (request_status === "Rejected") {
        //@ts-ignore
        for (const book of formData.books_required) {
          const { book_title } = book

          await tx
            .update(booksTable)
            .set({ availableCopies: sql`${booksTable.availableCopies} + 1` })
            .where(eq(booksTable.title, book_title))
            .execute()
        }
      }

      await tx.update(formsTable).set({ request_status }).where(eq(formsTable.form_number, form_number)).execute()
    })

    return NextResponse.json({ success: true, message: "Form updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error updating form:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
