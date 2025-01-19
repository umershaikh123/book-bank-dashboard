import { drizzle } from "drizzle-orm/neon-serverless"
import { formsTable } from "@/db/schema"
import { sql } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL || "")

export async function GET() {
  const now = new Date()

  try {
    const result = await db
      .update(formsTable)
      .set({ borrowed_status: "NotReturned" })
      .where(sql`return_date < ${now.toISOString()}`)
      .execute()

    return new Response(JSON.stringify({ success: true, updated: result }), { status: 200 })
  } catch (error: any) {
    console.error("Error updating borrowed_status:", error)
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 })
  }
}
