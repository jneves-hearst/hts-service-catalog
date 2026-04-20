import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_COOKIE_NAME, ADMIN_PASSWORD_FALLBACK } from "@/lib/constants"

export async function POST(request: Request) {
  const { password } = await request.json()
  const expected = process.env.ADMIN_PASSWORD ?? ADMIN_PASSWORD_FALLBACK

  if (password !== expected) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
  return NextResponse.json({ ok: true })
}
