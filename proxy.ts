import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE_NAME } from "@/lib/constants"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/* but NOT /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME)
    if (session?.value !== "1") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
