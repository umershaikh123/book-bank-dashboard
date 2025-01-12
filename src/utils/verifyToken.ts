"use server "
import { jwtVerify } from "jose"

export async function verifyToken(authHeader: string | undefined) {
  const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or invalid")
  }
  const token = authHeader.split(" ")[1]

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch (err) {
    throw new Error("Invalid or expired token")
  }
}
