// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

import { drizzle } from "drizzle-orm/neon-serverless"
import { studentsTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { SignJWT } from "jose"
const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service (Gmail, SendGrid, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Set your email here
    pass: process.env.EMAIL_PASSWORD, // Set your email password or an app password if 2FA is enabled
  },
})

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Fetch student data based on email
    const studentData = await db.select().from(studentsTable).where(eq(studentsTable.email, email)).execute()

    if (!studentData.length) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 })
    }

    // Create a JWT token for password reset with an expiration time

    const resetToken = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(SECRET_KEY)

    // Create the reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    // Send the email with the reset link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Password reset email sent successfully" }, { status: 200 })
  } catch (err: any) {
    console.error("Error sending password reset email:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
