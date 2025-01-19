import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

// Zod validation schema for student deletion
const deleteStudentSchema = z.object({
  mobile: z.string().min(1, "mobile no required").optional(),
})

export async function DELETE(req: Request) {
  const authHeader = req.headers.get("authorization")
  await verifyToken(authHeader || "")
  try {
    const body = await req.json()

    // Validate incoming data
    const parsedData = deleteStudentSchema.safeParse(body)
    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { mobile } = parsedData.data

    // Delete student from the database
    const result = await sql`
      DELETE FROM students WHERE mobile = ${mobile}
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Student deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
