import { NextResponse } from "next/server"

import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"
import { drizzle } from "drizzle-orm/neon-serverless"

import { formsTable } from "@/db/schema"

const db = drizzle(process.env.DATABASE_URL || "")
// Define Zod validation schema for forms
const formSchema = z.object({
  student_cnic: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, "Invalid CNIC format")
    .nonempty(),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father name is required"),
  mobile: z
    .string()
    .regex(/^0\d{3}-\d{7}$/, "Invalid mobile number format")
    .nonempty(),
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
  borrowed_status: z.enum(["borrowed", "returned", "NotReturned", "rejected", "not_yet"]),
  request_status: z.enum(["Pending", "Approved", "Accepted", "Rejected"]),
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
    const {
      student_cnic,
      name,
      father_name,
      mobile,
      address,
      books_required,
      book_return_date,
      borrowed_status,
      request_status,
    } = parsedData.data

    const result = await db
      .insert(formsTable)
      .values({
        student_cnic,
        name,
        father_name,
        mobile,
        address,
        books_required,
        borrowed_status,
        request_status,
        book_return_date,
      })
      .returning()

    return NextResponse.json({ success: true, message: "Form submitted successfully", data: result[0] }, { status: 200 })
  } catch (err) {
    console.error("Error inserting form:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
