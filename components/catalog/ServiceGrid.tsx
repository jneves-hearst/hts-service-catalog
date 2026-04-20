"use client"

import { useFilteredServices } from "@/hooks/useFilteredServices"
import { useCatalog } from "@/context/CatalogContext"
import { ServiceCard } from "./ServiceCard"
import { SearchX } from "lucide-react"

export function ServiceGrid() {
  const filtered = useFilteredServices()
  const { openDetail } = useCatalog()

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchX size={48} className="mb-4 text-gray-300 dark:text-gray-700" />
        <h3 className="mb-1 text-base font-semibold text-gray-500 dark:text-gray-400">No services found</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((service) => (
        <ServiceCard key={service.id} service={service} onClick={() => openDetail(service)} />
      ))}
    </div>
  )
}
