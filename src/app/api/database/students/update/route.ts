import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"
import { z } from "zod"
import bcrypt from "bcrypt"
import { studentSchema } from ".."
const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

// Use the updated schema for validation
const updateStudentSchema = studentSchema.partial()

export async function PUT(req: Request) {
  const authHeader = req.headers.get("authorization")
  await verifyToken(authHeader || "")
  try {
    const body = await req.json()

    // Validate incoming data
    const parsedData = updateStudentSchema.safeParse(body)
    if (!parsedData.success) {
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const {
      name,
      father_name,
      cnic,
      mobile,
      email,
      address,
      book_history,
      current_borrowed,
      TotalBooksBorrowed,
      TotalBooksReturned,
      TotalNotReturnedBooks,
    } = parsedData.data

    // Update student details in the database
    await sql`
      UPDATE students
      SET 
        name = ${name},
        father_name = ${father_name},
        cnic = ${cnic},
        mobile = ${mobile},
        email = ${email},
        address = ${address},
        book_history = ${book_history},
        current_borrowed = ${current_borrowed},
        TotalBooksBorrowed = ${TotalBooksBorrowed},
        TotalBooksReturned = ${TotalBooksReturned},
        TotalNotReturnedBooks = ${TotalNotReturnedBooks},
        updated_at = NOW()
      WHERE mobile = ${mobile}
    `

    return NextResponse.json({ success: true, message: "Student updated successfully" }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
