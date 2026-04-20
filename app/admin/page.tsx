export const dynamic = "force-dynamic"

import { readServices } from "@/lib/services"
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient"

export default async function AdminPage() {
  const services = await readServices()
  return <AdminDashboardClient initialServices={services} />
}
