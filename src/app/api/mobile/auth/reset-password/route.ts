// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server"

import bcrypt from "bcrypt"
import { jwtVerify } from "jose"

import { drizzle } from "drizzle-orm/neon-serverless"
import { studentsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()

    const { payload } = await jwtVerify(token, SECRET_KEY)

    const studentData = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.email, payload.email as any))
      .execute()

    if (!studentData.length) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db
      .update(studentsTable)
      .set({ password: hashedPassword })
      .where(eq(studentsTable.email, payload.email as any))
      .execute()

    return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 })
  } catch (err: any) {
    console.error("Error resetting password:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
