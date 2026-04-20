export const dynamic = "force-dynamic"

import Image from "next/image"
import { readServices } from "@/lib/services"
import { CatalogClient } from "@/components/catalog/CatalogClient"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { Settings } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const services = await readServices()

  return (
    <div className="flex min-h-screen flex-col">

      {/* Top nav — white, sticky */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Image
              src="/Logo.png"
              alt="Hearst"
              width={110}
              height={32}
              className="object-contain"
              priority
            />
            <div className="border-l border-gray-200 pl-4 dark:border-gray-700">
              <p className="text-sm font-semibold leading-none text-gray-900 dark:text-gray-100">HTS Service Catalog</p>
              <p className="mt-0.5 text-xs leading-tight text-gray-400 dark:text-gray-500">Hearst Technology Services</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <Settings size={14} />
            Admin
          </Link>
        </div>
      </header>

      {/* Hero banner image */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src="/Header.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Page title strip */}
      <div className="border-b border-gray-100 bg-white px-6 py-7 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-1.5 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Find the right service for your needs
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Browse {services.length} services across IT infrastructure, security, data, and business operations.
          </p>
        </div>
      </div>

      {/* Catalog */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <CatalogClient services={services} />
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden border-t border-gray-100 dark:border-gray-800">
        <Image
          src="/Footer.png"
          alt=""
          width={1200}
          height={60}
          className="h-auto w-full object-cover dark:opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-xs text-gray-400">Hearst Technology Services · Service Catalog</p>
        </div>
      </footer>

      <ThemeToggle />
    </div>
  )
}
