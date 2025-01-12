import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcrypt"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(req: Request) {
  try {
    const { email, name, father_name, mobile, address, password, cnic } = await req.json()

    // Check if email, mobile, or cnic already exist in the database
    const existingUser = await sql`
      SELECT 1 FROM students WHERE email = ${email} OR mobile = ${mobile} OR cnic = ${cnic}
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email, Mobile Number or CNIC already exists. Please use a unique value." },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new student into the database
    await sql`
      INSERT INTO students (email, name, cnic, father_name, mobile, address, password) 
      VALUES (${email}, ${name}, ${cnic}, ${father_name}, ${mobile}, ${address}, ${hashedPassword})
    `

    return NextResponse.json({ success: true, message: "Student registered successfully" }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
