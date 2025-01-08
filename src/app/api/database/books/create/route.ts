import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")

export async function POST(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS books (
        isbn TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        edition TEXT,
        category TEXT NOT NULL,
        availability_status JSONB,
        total_copies INTEGER NOT NULL,
        available_copies INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        subject TEXT NOT NULL,
        grade_level TEXT NOT NULL,
        image TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `
    return NextResponse.json({ success: true, message: "Table created successfully" }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 401 })
  }
}
