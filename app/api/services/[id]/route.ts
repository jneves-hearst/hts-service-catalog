import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findService, putService, deleteService } from "@/lib/services"
import { ADMIN_COOKIE_NAME } from "@/lib/constants"

type RouteContext = { params: Promise<{ id: string }> }

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === "1"
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const service = await findService(id)
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(service)
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const existing = await findService(id)

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = { ...existing, ...body, id, lastUpdated: new Date().toISOString() }
  await putService(updated)

  return NextResponse.json(updated)
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await findService(id)

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await deleteService(id)
  return new Response(null, { status: 204 })
}
