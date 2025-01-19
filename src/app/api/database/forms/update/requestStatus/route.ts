import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { sql } from "drizzle-orm"
import { formsTable, booksTable, studentsTable } from "@/db/schema"
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

    const formData: any = form[0]

    await db.transaction(async (tx) => {
      if (request_status === "Accepted") {
        const borrowed_status = "borrowed"

        const student = await tx
          .select()
          .from(studentsTable)
          .where(eq(studentsTable.student_cnic, formData.student_cnic))
          .execute()

        if (!student.length) {
          throw new Error("Student not found")
        }

        const studentData = student[0]

        const booksRequired = formData.books_required
        const bookEntries = booksRequired.map((book: { book_title: string }) => ({
          book_title: book.book_title,
          return_date: formData.book_return_date,
          borrowed_status: borrowed_status,
        }))
        console.log("bookEntries", bookEntries)

        console.log("studentData.book_history", studentData.book_history)

        console.log("[studentData.book_history, ...bookEntries]", [studentData.book_history, ...bookEntries])
        await tx
          .update(studentsTable)
          .set({
            totalBooksBorrowed: studentData.totalBooksBorrowed + 1,

            //@ts-ignore
            book_history: studentData.book_history.length > 0 ? [...studentData.book_history, ...bookEntries] : [...bookEntries],
            current_borrowed: [...bookEntries],
          })
          .where(eq(studentsTable.student_cnic, formData.student_cnic))
          .execute()

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
