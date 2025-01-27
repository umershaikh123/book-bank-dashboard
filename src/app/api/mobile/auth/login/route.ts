import { NextResponse } from "next/server"
import { drizzle } from "drizzle-orm/neon-serverless"
import bcrypt from "bcrypt"
import { SignJWT } from "jose"
import { studentsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")

const db = drizzle(process.env.DATABASE_URL || "")

export async function POST(req: Request) {
  try {
    const { email, password, fcmToken } = await req.json()
    const student = await db.select().from(studentsTable).where(eq(studentsTable.email, email)).execute()

    if (!student || student.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 401 })
    }

    if (fcmToken) {
      await db.update(studentsTable).set({ fcmToken }).where(eq(studentsTable.email, email)).execute()
    }

    // Verify the password
    const isValidPassword = await bcrypt.compare(password, student[0].password)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 })
    }

    // Create a JWT token
    const token = await new SignJWT({ email }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().sign(SECRET_KEY)

    return NextResponse.json(
      {
        success: true,
        jwt: token,
        data: {
          ...student[0],
          fcmToken,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
