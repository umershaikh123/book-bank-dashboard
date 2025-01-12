import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { formSchema } from ".."
// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
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

    // Insert the form data into the database
    await sql`
      INSERT INTO forms (form_number, student_cnic, name, father_name, mobile, address, books_required, borrowed_status, request_status, created_at, updated_at)
      VALUES (${form_number}, ${student_cnic}, ${name}, ${father_name}, ${mobile}, ${address}, ${books_required}, ${borrowed_status}, ${request_status}, ${created_at}, ${updated_at})
    `

    return NextResponse.json({ success: true, message: "Form submitted successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
