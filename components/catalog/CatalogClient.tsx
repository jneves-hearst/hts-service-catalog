"use client"

import { Service } from "@/types"
import { CatalogProvider } from "@/context/CatalogContext"
import { SearchBar } from "./SearchBar"
import { FilterBar } from "./FilterBar"
import { ServiceGrid } from "./ServiceGrid"
import { ServiceDetailPanel } from "./ServiceDetailPanel"
import { useFilteredServices } from "@/hooks/useFilteredServices"

function CatalogHeader() {
  const filtered = useFilteredServices()
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{filtered.length}</span> service
      {filtered.length !== 1 ? "s" : ""}
    </p>
  )
}

export function CatalogClient({ services }: { services: Service[] }) {
  return (
    <CatalogProvider initialServices={services}>
      <div className="flex flex-col gap-6">
        {/* Search + count row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar />
          <CatalogHeader />
        </div>

        {/* Filters */}
        <FilterBar />

        {/* Grid */}
        <ServiceGrid />

        {/* Detail panel */}
        <ServiceDetailPanel />
      </div>
    </CatalogProvider>
  )
}
