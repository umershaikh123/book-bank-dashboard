// app/actions.ts
"use server"
import { neon } from "@neondatabase/serverless"

export async function insertData() {
  const sql = neon(process.env.DATABASE_URL || "invalid")
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
  return data
}

export async function getData() {
  const sql = neon(process.env.DATABASE_URL || "invalid")
  const users = await sql`SELECT * FROM users`
  console.log("users", users)

  const plainUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
  }))
  console.log("plainUsers", plainUsers)
  return plainUsers
}
