import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function middleware(req: NextRequest) {
  console.log("Running middleware")

  const authToken = req.cookies.get("auth_token")?.value
  const currentPath = req.nextUrl.pathname

  // Guard condition to avoid redirect loops
  const isLoginPage = currentPath === "/login"
  const isAdminPage = currentPath.startsWith("/admin/books")
  const isHomePage = currentPath === "/"

  if (!authToken) {
    console.log("No auth token")

    // Allow access to the login page even if unauthenticated
    if (isLoginPage) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    console.log("Verifying JWT")
    await jwtVerify(authToken, SECRET_KEY)

    // If authenticated and on login page, redirect to admin page
    if (isLoginPage || isHomePage) {
      return NextResponse.redirect(new URL("/admin/books", req.url))
    }

    // Allow access to protected routes
    return NextResponse.next()
  } catch (err) {
    console.log("Invalid token", err)

    // Redirect invalid token users to login, but avoid loops
    if (isLoginPage) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/:path", "/login:path", "/admin/:path*"],
}
