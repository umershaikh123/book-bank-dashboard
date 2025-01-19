import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const existingUser = await sql`
      SELECT 1 FROM students WHERE email = ${email} 
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Email does not exists" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
