import { drizzle } from "drizzle-orm/neon-serverless"
import { notificationsTable } from "@/db/schema"
import { NotificationMessage } from "@/db/schema"
import { NextResponse } from "next/server"

const db = drizzle(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { email, messages }: { email: string; messages: NotificationMessage } = await req.json()

    await db.insert(notificationsTable).values({ email, messages, created_at: new Date(), updated_at: new Date() }).execute()

    return NextResponse.json({ success: true, message: "Notification added successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error adding notification:", error)
    return NextResponse.json({ success: false, error: "Failed to add notification" }, { status: 500 })
  }
}
