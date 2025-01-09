import { NextResponse } from "next/server"
import { SignJWT } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key") // Secure key

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (username === adminUsername && password === adminPassword) {
    // Generate a JWT token
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET_KEY)
    const response = NextResponse.json({ success: true })
    console.log("token", token)
    response.cookies.set("auth_token", token, { httpOnly: true, path: "/", secure: true })
    return response
  }

  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
}
