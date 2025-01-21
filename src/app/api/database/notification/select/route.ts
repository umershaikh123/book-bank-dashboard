import { drizzle } from "drizzle-orm/neon-serverless"
import { notificationsTable } from "@/db/schema"

import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { jwtVerify } from "jose"

const db = drizzle(process.env.DATABASE_URL || "")
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Authorization token is missing or invalid" }, { status: 401 })
    }
    await verifyToken(authHeader || "")
    const token = authHeader.split(" ")[1]
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const email = payload.email

    if (!email) {
      return NextResponse.json({ success: false, error: "Invalid token: email not found" }, { status: 401 })
    }

    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.email, email as any))
      .execute()

    return NextResponse.json({ success: true, notifications }, { status: 200 })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}
