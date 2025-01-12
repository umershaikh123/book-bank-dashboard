import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"
import { formSchema } from ".."
// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

// Zod validation schema for form submission

export async function PUT(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()

    // Validate the incoming data
    const parsedData = formSchema.safeParse(body)
    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    // Extract the validated data
    const {
      form_number,
      student_cnic,
      name,
      father_name,
      mobile,
      address,
      books_required,
      borrowed_status,
      request_status,
      created_at,
      updated_at,
    } = parsedData.data

    // Update the form data in the database
    await sql`
      UPDATE forms
      SET student_cnic = ${student_cnic}, name = ${name}, father_name = ${father_name}, mobile = ${mobile}, 
          address = ${address}, books_required = ${books_required}, borrowed_status = ${borrowed_status}, 
          request_status = ${request_status}, updated_at = ${updated_at}
      WHERE form_number = ${form_number}
    `

    return NextResponse.json({ success: true, message: "Form updated successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
