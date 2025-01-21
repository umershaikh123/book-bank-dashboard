import { drizzle } from "drizzle-orm/neon-serverless"
import { notificationsTable } from "@/db/schema"

import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const notifications = await db.select().from(notificationsTable).where(eq(notificationsTable.email, email)).execute()

    return NextResponse.json({ success: true, notifications }, { status: 200 })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}
