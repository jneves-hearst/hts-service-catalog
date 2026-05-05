import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE_NAME, BETA_COOKIE_NAME } from "@/lib/constants"

const BETA_PUBLIC_PATHS = ["/login", "/api/beta-auth", "/admin", "/api/auth"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Beta gate — protect entire site except login-related paths
  const isBetaPublic =
    BETA_PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpg|svg|ico|css|js)$/)

  if (!isBetaPublic) {
    const hasBetaAccess = request.cookies.get(BETA_COOKIE_NAME)?.value === "1"
    if (!hasBetaAccess) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Admin gate — protect /admin/* but NOT /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME)
    if (session?.value !== "1") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
