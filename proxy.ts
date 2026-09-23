import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE_NAME } from "@/lib/constants"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Beta gate temporarily disabled — the site-wide /login screen no longer
  // gates access. The /login page and /api/beta-auth route remain in place so
  // this can be re-enabled by restoring the beta-cookie redirect here.

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
