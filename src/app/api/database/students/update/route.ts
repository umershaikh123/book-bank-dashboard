import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"

import { studentsTable } from "@/db/schema"
import { z } from "zod"
import { jwtVerify } from "jose"

const db = drizzle(process.env.DATABASE_URL || "")
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
export const dynamic = "force-dynamic"

const updateStudentSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  father_name: z.string().min(1, "Father's name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
  address: z.string().min(1, "Address is required").optional(),
})

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Authorization token is missing or invalid" }, { status: 401 })
    }
    await verifyToken(authHeader || "")
    const token = authHeader.split(" ")[1]
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const userEmail = payload.email

    if (!userEmail) {
      return NextResponse.json({ success: false, error: "Invalid token: email not found" }, { status: 401 })
    }

    const body = await req.json()
    console.log("Request body:", body)

    const parsedData = updateStudentSchema.safeParse(body)
    if (!parsedData.success) {
      console.error("Validation errors:", parsedData.error.errors)
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { ...updateFields } = parsedData.data

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ success: false, error: "No fields provided for update" }, { status: 400 })
    }
    await db
      .update(studentsTable)
      .set(updateFields)
      .where(eq(studentsTable.email, userEmail as any))
      .execute()

    return NextResponse.json({ success: true, message: "Student updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error updating student:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
