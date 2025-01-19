import { drizzle } from "drizzle-orm/neon-serverless"
import { formsTable } from "@/db/schema"
import { sql, and, eq } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export async function GET() {
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  console.log("running request-status cron")
  try {
    const result = await db
      .update(formsTable)
      .set({ request_status: "Rejected" })
      .where(and(eq(formsTable.request_status, "Approved"), sql`created_at < ${twentyFourHoursAgo.toISOString()}`))
      .execute()

    return new Response(JSON.stringify({ success: true, updated: result }), { status: 200 })
  } catch (error: any) {
    console.error("Error updating request_status:", error)
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 })
  }
}
