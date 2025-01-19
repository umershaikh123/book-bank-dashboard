import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { drizzle } from "drizzle-orm/neon-serverless"
import { formsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const { searchParams } = new URL(req.url)
    const borrowed_status = searchParams.get("borrowed_status")

    const forms = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.borrowed_status, borrowed_status || "borrowed"))

    return NextResponse.json({ success: true, data: forms }, { status: 200 })
  } catch (err: any) {
    console.error("Error fetching books:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
