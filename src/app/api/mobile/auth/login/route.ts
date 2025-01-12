import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcrypt"
import { SignJWT } from "jose"

const sql = neon(process.env.DATABASE_URL || "")
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const student = await sql`
      SELECT email, password 
      FROM students 
      WHERE email = ${email}
    `

    if (!student || student.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 401 })
    }

    // Verify the password
    const isValidPassword = await bcrypt.compare(password, student[0].password)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
    }

    // Create a JWT token
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(SECRET_KEY)

    return NextResponse.json({ success: true, jwt: token }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
