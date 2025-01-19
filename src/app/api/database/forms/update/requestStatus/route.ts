import { NextResponse } from "next/server"
import { verifyToken } from "@/utils/verifyToken"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"

import { formsTable } from "@/db/schema"
import { z } from "zod"

const db = drizzle(process.env.DATABASE_URL || "")

const updateFormSchema = z.object({
  form_number: z.number().min(1, "Form number is required"),
  request_status: z.enum(["Pending", "Approved", "Accepted", "Rejected"]),
})

export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    const body = await req.json()
    console.log("body ", body)
    const parsedData = updateFormSchema.safeParse(body)

    if (!parsedData.success) {
      console.log("parsedData.error.errors", parsedData.error.errors)
      return NextResponse.json({ success: false, error: parsedData.error.errors }, { status: 400 })
    }

    const { form_number, request_status } = parsedData.data

    await db.update(formsTable).set({ request_status }).where(eq(formsTable.form_number, form_number)).execute()

    return NextResponse.json({ success: true, message: "Form updated successfully" }, { status: 200 })
  } catch (err) {
    console.error("Error updating form:", err)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
