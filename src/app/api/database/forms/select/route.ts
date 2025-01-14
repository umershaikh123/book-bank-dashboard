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
    const formStatus = searchParams.get("formStatus")

    // Select books by formStatus
    console.log("formStatus", formStatus)
    const forms = await db
      .select()
      .from(formsTable)
      .where(eq(formsTable.request_status, formStatus || "Pending"))
    console.log("Filtered by formStatus:", forms)

    return NextResponse.json({ success: true, data: forms }, { status: 200 })
  } catch (err: any) {
    console.error("Error fetching books:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

// const sql = neon(process.env.DATABASE_URL || "")
// export const dynamic = "force-dynamic"
// export async function GET(req: Request) {
//   try {
//     // Verify JWT
//     const authHeader = req.headers.get("authorization")
//     await verifyToken(authHeader || "")

//     // Fetch books from the database
//     const forms = await sql`
//       SELECT
//       *
//       FROM forms
//     `

//     return NextResponse.json({ success: true, data: forms }, { status: 200 })
//   } catch (err) {
//     console.error("Error fetching forms:", err)
//     return NextResponse.json({ success: false, error: err }, { status: 401 })
//   }
// }
