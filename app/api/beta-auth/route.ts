import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { BETA_COOKIE_NAME, BETA_PASSWORD } from "@/lib/constants"

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password !== BETA_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(BETA_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return NextResponse.json({ ok: true })
}
