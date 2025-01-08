import { NextResponse } from "next/server"

import { neon } from "@neondatabase/serverless"
export async function POST(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL || "invalid")
    console.log("sql", sql)
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `

    await sql`
    INSERT INTO users (name) VALUES ('Alice'), ('Bob')
  `

    const data = await sql`SELECT * FROM users`
    console.log("data", data)

    return NextResponse.json({ success: true, message: "Data inserted successfully" }, { status: 200 })
  } catch (e) {
    console.error("Error creating table or inserting data:", e)
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}

export async function GET() {
  const sql = neon(process.env.DATABASE_URL || "invalid")
  try {
    // Fetch data from the users table
    const users = await sql`SELECT * FROM users`

    // Transform data into a plain object format
    const plainUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
    }))

    return NextResponse.json({ success: true, data: plainUsers }, { status: 200 })
  } catch (e) {
    console.error("Error fetching data:", e)
    return NextResponse.json({ success: false, error: e }, { status: 500 })
  }
}
