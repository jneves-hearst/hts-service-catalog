"use client"

import { useMemo } from "react"
import { useCatalog } from "@/context/CatalogContext"
import { Service } from "@/types"

export function useFilteredServices(): Service[] {
  const { services, searchQuery, activeCategories, activeServiceType, activeTags } = useCatalog()

  return useMemo(() => {
    let result = services

    if (activeCategories.length > 0) {
      result = result.filter((s) => activeCategories.includes(s.category))
    }

    if (activeServiceType) {
      result = result.filter((s) => s.serviceType === activeServiceType)
    }

    if (activeTags.length > 0) {
      result = result.filter((s) => activeTags.every((t) => s.tags.includes(t)))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.owner.name.toLowerCase().includes(q)
      )
    }

    return result
  }, [services, searchQuery, activeCategories, activeServiceType, activeTags])
}
