import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { readServices, putService } from "@/lib/services"
import { ADMIN_COOKIE_NAME } from "@/lib/constants"
import { Service } from "@/types"

export async function GET() {
  const services = await readServices()
  return NextResponse.json(services)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  if (cookieStore.get(ADMIN_COOKIE_NAME)?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const newService: Service = {
    ...body,
    id: crypto.randomUUID(),
    lastUpdated: new Date().toISOString(),
  }

  await putService(newService)

  return NextResponse.json(newService, { status: 201 })
}
