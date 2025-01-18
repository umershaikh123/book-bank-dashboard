import { drizzle } from "drizzle-orm/neon-serverless"
import { studentsTable } from "@/db/schema"
import { eq, gt } from "drizzle-orm"
import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
const db = drizzle(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const { searchParams } = new URL(req.url)
    const studentStatus = searchParams.get("studentStatus")

    const query = db.select().from(studentsTable)

    // Filter based on studentStatus
    if (studentStatus === "whiteListed") {
      query.where(eq(studentsTable.totalBooksNotReturned, 0))
    } else if (studentStatus === "BlackListed") {
      query.where(gt(studentsTable.totalBooksNotReturned, 0))
    }

    const students = await query
    return NextResponse.json(students, { status: 200 })
  } catch (err) {
    console.error("Failed to fetch students:", err)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
