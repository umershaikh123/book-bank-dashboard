import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function DELETE(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Get the form_number from the request body
    const body = await req.json()
    const { form_number } = body

    // Delete the form entry from the database
    await sql`
      DELETE FROM forms WHERE form_number = ${form_number}
    `

    return NextResponse.json({ success: true, message: "Form deleted successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
