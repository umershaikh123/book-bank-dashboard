import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { drizzle } from "drizzle-orm/neon-serverless"
import { bookRequestsTable } from "@/db/schema"

const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const result = await db.select().from(bookRequestsTable)

    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (err: any) {
    console.error("Error fetching books request data:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
