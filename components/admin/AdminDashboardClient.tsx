"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { AdminProvider } from "@/context/AdminContext"
import { ServiceTable } from "./ServiceTable"
import { ServiceFormModal } from "./ServiceFormModal"
import { DeleteConfirmModal } from "./DeleteConfirmModal"
import { Service } from "@/types"
import { ExternalLink, LogOut } from "lucide-react"

function AdminNav() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Image src="/Logo.png" alt="Hearst" width={100} height={30} className="object-contain" />
          <div className="border-l border-gray-200 pl-4">
            <p className="text-sm font-semibold leading-none text-gray-900">Admin Console</p>
            <p className="mt-0.5 text-xs leading-tight text-gray-400">HTS Service Catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ExternalLink size={13} />
            View Catalog
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export function AdminDashboardClient({ initialServices }: { initialServices: Service[] }) {
  return (
    <AdminProvider initialServices={initialServices}>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AdminNav />
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Services</h2>
            <p className="text-sm text-gray-500">Manage the HTS service catalog</p>
          </div>
          <ServiceTable />
        </main>
      </div>
      <ServiceFormModal />
      <DeleteConfirmModal />
    </AdminProvider>
  )
}
