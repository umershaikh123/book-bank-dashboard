import { drizzle } from "drizzle-orm/neon-serverless"
import { formsTable, booksTable, studentsTable, notificationsTable } from "@/db/schema"
import { sql, and, eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export async function GET() {
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  console.log("Running request-status cron")

  try {
    const formsToReject = await db
      .select({
        form_id: formsTable.form_number,
        books_required: formsTable.books_required,
        form_number: formsTable.form_number,
        student_cnic: formsTable.student_cnic,
        student_email: studentsTable.email, // Fetch email via join
        student_fcm: studentsTable.fcmToken,
        student_name: studentsTable.name,
      })
      .from(formsTable)
      .leftJoin(studentsTable, eq(formsTable.student_cnic, studentsTable.student_cnic)) // Join with studentsTable
      .where(and(eq(formsTable.request_status, "Approved"), sql`${formsTable.created_at} < ${twentyFourHoursAgo.toISOString()}`))

    if (formsToReject.length === 0) {
      console.log("No forms to reject.")
      return new Response(JSON.stringify({ success: true, message: "No updates necessary" }), { status: 200 })
    }

    await db.transaction(async (tx) => {
      for (const form of formsToReject) {
        const { books_required, form_number, student_email, student_fcm, student_name } = form

        // Update request_status to "Rejected"
        await tx.update(formsTable).set({ request_status: "Rejected" }).where(eq(formsTable.form_number, form.form_id)).execute()

        // Increment availableCopies for each book in the rejected form
        //@ts-ignore
        for (const book of books_required) {
          const { book_title } = book

          await tx
            .update(booksTable)
            .set({ availableCopies: sql`${booksTable.availableCopies} + 1` })
            .where(eq(booksTable.title, book_title))
            .execute()
        }

        if (student_fcm) {
          try {
            const failedCollectionMessage = {
              to: student_fcm,
              notification: {
                title: "❗ Form Rejected Due to Non-Collection!",
                body: `Oh no, ${student_name}! You failed to collect your books within 24 hours, so your form #${form_number} has been rejected. 😞 Please try again next time.`,
              },
              data: {
                customKey1: "value1",
                customKey2: "value2",
                form_number: form_number,
                student_name: student_name,
                status: "Rejected",
                severity: "urgent",
                timestamp: new Date().toISOString(),
              },
            }

            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `key=${process.env.FCM_SERVER_KEY}`,
              },
              body: JSON.stringify(failedCollectionMessage),
            })

            const responseData = await response.json()
            if (!response.ok) {
              throw new Error(`Failed to send notification: ${responseData.error}`)
            }

            console.log("Notification sent successfully:", responseData)
          } catch (error) {
            console.error("Error sending notification:", error)
          }
        }

        // Insert notification for the student
        const message = {
          text: `You failed to collect your books from ICC within 24hrs, so your form ${form_number} has been rejected.`,
          severity: "urgent" as const,
        }

        await tx
          .insert(notificationsTable)
          .values({
            email: student_email || "null",
            messages: message,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .execute()
      }
    })

    return new Response(JSON.stringify({ success: true, message: "Request statuses updated" }), {
      status: 200,
    })
  } catch (error: any) {
    console.error("Error updating request_status:", error)
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 })
  }
}
