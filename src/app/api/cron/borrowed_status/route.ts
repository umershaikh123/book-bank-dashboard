import { drizzle } from "drizzle-orm/neon-serverless"
import { formsTable, studentsTable, notificationsTable } from "@/db/schema"
import { sql, eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export async function GET() {
  const now = new Date()

  try {
    // Fetch forms with overdue return dates
    const formsToUpdate = await db
      .select({
        form_number: formsTable.form_number,
        student_cnic: formsTable.student_cnic,
        books_required: formsTable.books_required,
        book_return_date: formsTable.book_return_date,
      })
      .from(formsTable)
      .where(sql`return_date < ${now.toISOString()}`)

    if (formsToUpdate.length === 0) {
      console.log("No overdue forms to update.")
      return new Response(JSON.stringify({ success: true, message: "No updates necessary" }), { status: 200 })
    }

    await db.transaction(async (tx) => {
      for (const form of formsToUpdate) {
        const { form_number, student_cnic, books_required, book_return_date } = form

        // Fetch student data
        const [studentData] = await tx
          .select({
            email: studentsTable.email,
            book_history: studentsTable.book_history,
            totalBooksNotReturned: studentsTable.totalBooksNotReturned,
          })
          .from(studentsTable)
          .where(eq(studentsTable.student_cnic, student_cnic))

        if (!studentData) {
          console.error(`No student found for CNIC: ${student_cnic}`)
          continue
        }

        // Update book history
        //@ts-ignore
        const bookEntries = books_required.map((book: { book_title: string }) => ({
          book_title: book.book_title,
          return_date: book_return_date,
          borrowed_status: "NotReturned",
        }))
        //@ts-ignore
        const updatedBookHistory = studentData.book_history.map((entry: any) => {
          const matchingBook = bookEntries.find((book: { book_title: string }) => book.book_title === entry.book_title)
          return matchingBook ? { ...entry, borrowed_status: "NotReturned" } : entry
        })

        // Update student data
        await tx
          .update(studentsTable)
          .set({
            totalBooksNotReturned: studentData.totalBooksNotReturned + 1,
            book_history: updatedBookHistory,
          })
          .where(eq(studentsTable.student_cnic, student_cnic))
          .execute()

        const message = {
          text: `Please return your books. The return date has passed for form number ${form_number}.`,
          severity: "normal" as const,
        }

        await tx
          .insert(notificationsTable)
          .values({
            email: studentData.email,
            messages: message,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .execute()

        // Update the borrowed_status in the forms table
        await tx
          .update(formsTable)
          .set({ borrowed_status: "NotReturned" })
          .where(eq(formsTable.form_number, form_number))
          .execute()
      }
    })

    return new Response(JSON.stringify({ success: true, message: "Borrowed statuses updated successfully" }), { status: 200 })
  } catch (error: any) {
    console.error("Error updating borrowed_status:", error)
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 })
  }
}
