import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { drizzle } from "drizzle-orm/neon-serverless"
import { formsTable, booksTable } from "@/db/schema"
import { eq, sql, inArray } from "drizzle-orm"
import { jwtVerify } from "jose"
import { studentsTable } from "@/db/schema"
const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Authorization token is missing or invalid" }, { status: 401 })
    }
    await verifyToken(authHeader || "")
    const token = authHeader.split(" ")[1]
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const StudentEmail = payload.email

    if (!StudentEmail) {
      return NextResponse.json({ success: false, error: "Invalid token: email not found" }, { status: 401 })
    }

    const studentData = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.email, StudentEmail as any))
      .execute()

    // Fetch all forms for the student where borrowed_status is "not_yet"
    const forms = await db
      .select()
      .from(formsTable)
      .where(sql`${formsTable.borrowed_status} = 'not_yet' AND ${formsTable.student_cnic} = ${studentData[0].student_cnic}`)
      // .where(sql`${formsTable.borrowed_status} = 'not_yet' AND ${formsTable.student_cnic} = '5200010215153'`)
      .execute()
    console.log("forms", forms)
    if (!forms.length) {
      return NextResponse.json({ success: true, data: [], message: "No forms found" }, { status: 200 })
    }

    // Extract book titles from forms
    const allBooksRequired = forms.flatMap((form: any) => form.books_required.map((b: { book_title: string }) => b.book_title))

    // Fetch book details for all required books
    const books = await db.select().from(booksTable).where(inArray(booksTable.title, allBooksRequired)).execute()

    // Map forms with their corresponding book details
    const result = forms.map((form: any) => ({
      ...form,
      books_details: form.books_required.map((requiredBook: { book_title: string }) => {
        return books.find((book) => book.title === requiredBook.book_title) || null
      }),
    }))

    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (err: any) {
    console.error("Error fetching forms:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}