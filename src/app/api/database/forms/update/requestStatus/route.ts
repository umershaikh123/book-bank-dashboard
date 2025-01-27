import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { sql } from "drizzle-orm"
import { formsTable, booksTable, studentsTable } from "@/db/schema"
import { z } from "zod"
import { notificationsTable } from "@/db/schema"
import { NotificationMessage } from "@/db/schema"
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

    const student = await db.select().from(studentsTable).where(eq(studentsTable.student_cnic, formData.student_cnic)).execute()

    if (!student.length) {
      throw new Error("Student not found")
    }

    const studentData = student[0]

    await db.transaction(async (tx) => {
      if (request_status === "Accepted") {
        const borrowed_status = "borrowed"

        const booksRequired = formData.books_required
        const bookEntries = booksRequired.map((book: { book_title: string }) => ({
          book_title: book.book_title,
          return_date: formData.book_return_date,
          borrowed_status: borrowed_status,
        }))

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

        if (studentData.fcmToken) {
          try {
            const notificationData = {
              to: studentData.fcmToken,
              notification: {
                title: "🎉 Your Request Has Been Accepted!",
                body: `Hello ${studentData.name}, your request with Form #${formData.form_number} has been successfully accepted! 📝🎉`,
              },
              data: {
                customKey1: "value1",
                customKey2: "value2",
                form_number: formData.form_number,
                student_name: studentData.name,
                status: "Accepted",
                timestamp: new Date().toISOString(),
              },
            }

            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `key=${process.env.FCM_SERVER_KEY}`,
              },
              body: JSON.stringify(notificationData),
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

        if (studentData.fcmToken) {
          try {
            const notificationData = {
              to: studentData.fcmToken,
              notification: {
                title: "🎉 Your Request Has Been Accepted!",
                body: `Hello ${studentData.name}, your request with Form #${formData.form_number} has been successfully accepted! 📝🎉`,
              },
              data: {
                form_number: formData.form_number,
                student_name: studentData.name,
                status: "Accepted",
                timestamp: new Date().toISOString(),
              },
            }

            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `key=${process.env.FCM_SERVER_KEY}`,
              },
              body: JSON.stringify(notificationData),
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

        const message = {
          text: `Your request with form number ${formData.form_number} has been Accepted.`,
          severity: "normal" as const,
        }
        await tx
          .insert(notificationsTable)
          .values({ email: studentData.email, messages: message, created_at: new Date(), updated_at: new Date() })
          .execute()

        return NextResponse.json({ success: true, message: "Form updated successfully" }, { status: 200 })
      }

      // If request_status is "Rejected", update availableCopies
      else if (request_status === "Rejected") {
        //@ts-ignore
        for (const book of formData.books_required) {
          const { book_title } = book

          await tx
            .update(booksTable)
            .set({ availableCopies: sql`${booksTable.availableCopies} + 1` })
            .where(eq(booksTable.title, book_title))
            .execute()
        }

        if (studentData.fcmToken) {
          try {
            const notificationData = {
              to: studentData.fcmToken,
              notification: {
                title: "🎉 Your Request Has Been Accepted!",
                body: `Hello ${studentData.name}, your request with Form #${formData.form_number} has been successfully accepted! 📝🎉`,
              },
              data: {
                customKey1: "value1",
                customKey2: "value2",
                form_number: formData.form_number,
                student_name: studentData.name,
                status: "Accepted",
                timestamp: new Date().toISOString(),
              },
            }

            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `key=${process.env.FCM_SERVER_KEY}`,
              },
              body: JSON.stringify(notificationData),
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

        const message = {
          text: `Your form ${formData.form_number} has been rejected`,
          severity: "urgent" as const,
        }

        await tx
          .insert(notificationsTable)
          .values({ email: studentData.email, messages: message, created_at: new Date(), updated_at: new Date() })
          .execute()
      } else if (request_status === "Approved") {
        if (studentData.fcmToken) {
          try {
            const approvedMessage = {
              to: studentData.fcmToken,
              notification: {
                title: "✅ Your Request Has Been Approved!",
                body: `Congratulations, ${studentData.name}! Your request with form #${formData.form_number} has been approved. 🎉 Please collect your books from the ICC Book Bank within 24 hours! 📚`,
              },
              data: {
                customKey1: "value1",
                customKey2: "value2",
                form_number: formData.form_number,
                student_name: studentData.name,
                status: "Approved",
                severity: "normal", // Normal urgency
                timestamp: new Date().toISOString(),
              },
            }

            const response = await fetch("https://fcm.googleapis.com/fcm/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `key=${process.env.FCM_SERVER_KEY}`,
              },
              body: JSON.stringify(approvedMessage),
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

        const message = {
          text: `Your request with form number ${formData.form_number} has been approved. Please collect your books from ICC book bank with in 24 hours`,
          severity: "normal" as const,
        }
        await tx
          .insert(notificationsTable)
          .values({ email: studentData.email, messages: message, created_at: new Date(), updated_at: new Date() })
          .execute()
      }

      await tx.update(formsTable).set({ request_status }).where(eq(formsTable.form_number, form_number)).execute()
    })

    return NextResponse.json({ success: true, message: "Form updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error updating form:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
