import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { sql } from "drizzle-orm"
import { formsTable, booksTable, studentsTable } from "@/db/schema"
import { z } from "zod"
import { notificationsTable } from "@/db/schema"
const db = drizzle(process.env.DATABASE_URL || "")

const updateFormSchema = z.object({
  form_number: z.number().min(1, "Form number is required"),
  borrowed_status: z.enum(["borrowed", "returned", "NotReturned"]),
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

    const { form_number, borrowed_status } = parsedData.data

    const form = await db.select().from(formsTable).where(eq(formsTable.form_number, form_number)).execute()

    if (!form.length) {
      return NextResponse.json({ success: false, error: "Form not found" }, { status: 404 })
    }

    const formData: any = form[0]
    console.log("formData", formData)

    const student = await db.select().from(studentsTable).where(eq(studentsTable.student_cnic, formData.student_cnic)).execute()

    if (!student.length) {
      throw new Error("Student not found")
    }

    const studentData = student[0]
    await db.transaction(async (tx) => {
      if (borrowed_status === "returned") {
        const booksRequired = formData.books_required
        const bookEntries = booksRequired.map((book: { book_title: string }) => ({
          book_title: book.book_title,
          return_date: formData.book_return_date,
          borrowed_status: borrowed_status,
        }))

        //@ts-ignore
        const updatedBookHistory = (studentData.book_history || []).map((entry: any) => {
          const matchingBook = bookEntries.find((book: { book_title: string }) => book.book_title === entry.book_title)
          console.log("matchingBook", matchingBook)
          console.log("entry", entry)
          return matchingBook ? { ...entry, borrowed_status: borrowed_status } : entry
        })
        console.log("updatedBookHistory", updatedBookHistory)

        await tx
          .update(studentsTable)
          .set({
            totalBooksReturned: studentData.totalBooksReturned + 1,
            book_history: updatedBookHistory,
            current_borrowed: [],
          })
          .where(eq(studentsTable.student_cnic, formData.student_cnic))
          .execute()
        //@ts-ignore
        for (const book of formData.books_required) {
          const { book_title } = book

          await tx
            .update(booksTable)
            .set({ availableCopies: sql`${booksTable.availableCopies} + 1` })
            .where(eq(booksTable.title, book_title))
            .execute()
        }

        const message = {
          text: `You have successfully returned the books of form number ${formData.form_number}`,
          severity: "normal" as const,
        }
        await tx
          .insert(notificationsTable)
          .values({ email: studentData.email, messages: message, created_at: new Date(), updated_at: new Date() })
          .execute()
      }

      if (borrowed_status === "NotReturned") {
        const booksRequired = formData.books_required
        const bookEntries = booksRequired.map((book: { book_title: string }) => ({
          book_title: book.book_title,
          return_date: formData.book_return_date,
          borrowed_status: borrowed_status,
        }))

        //@ts-ignore
        const updatedBookHistory = studentData.book_history.map((entry: any) => {
          const matchingBook = bookEntries.find((book: { book_title: string }) => book.book_title === entry.book_title)

          return matchingBook ? { ...entry, borrowed_status: borrowed_status } : entry
        })
        console.log("updatedBookHistory", updatedBookHistory)
        await tx
          .update(studentsTable)
          .set({
            totalBooksNotReturned: studentData.totalBooksNotReturned + 1,
            book_history: updatedBookHistory,
          })
          .where(eq(studentsTable.student_cnic, formData.student_cnic))
          .execute()

        const message = {
          text: `Please return your books , the return date has been passed. form number ${formData.form_number}`,
          severity: "normal" as const,
        }
        await tx
          .insert(notificationsTable)
          .values({ email: studentData.email, messages: message, created_at: new Date(), updated_at: new Date() })
          .execute()
      }

      await tx.update(formsTable).set({ borrowed_status }).where(eq(formsTable.form_number, form_number)).execute()
    })

    return NextResponse.json({ success: true, message: "Form updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error updating form:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
