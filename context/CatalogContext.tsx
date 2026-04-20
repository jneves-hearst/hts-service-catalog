"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Service, Category, ServiceType } from "@/types"

interface CatalogState {
  services: Service[]
  searchQuery: string
  activeCategories: Category[]
  activeServiceType: ServiceType | null
  activeTags: string[]
  selectedService: Service | null
  isDetailOpen: boolean
}

interface CatalogActions {
  setSearchQuery: (q: string) => void
  toggleCategory: (c: Category) => void
  setServiceType: (t: ServiceType | null) => void
  toggleTag: (t: string) => void
  openDetail: (service: Service) => void
  closeDetail: () => void
  clearFilters: () => void
}

const CatalogContext = createContext<(CatalogState & CatalogActions) | null>(null)

export function CatalogProvider({
  children,
  initialServices,
}: {
  children: ReactNode
  initialServices: Service[]
}) {
  const [services] = useState<Service[]>(initialServices)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategories, setActiveCategories] = useState<Category[]>([])
  const [activeServiceType, setActiveServiceType] = useState<ServiceType | null>(null)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const toggleCategory = (c: Category) => {
    setActiveCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    )
  }

  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  const openDetail = (service: Service) => {
    setSelectedService(service)
    setIsDetailOpen(true)
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => setSelectedService(null), 300)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setActiveCategories([])
    setActiveServiceType(null)
    setActiveTags([])
  }

  return (
    <CatalogContext.Provider
      value={{
        services,
        searchQuery,
        activeCategories,
        activeServiceType,
        activeTags,
        selectedService,
        isDetailOpen,
        setSearchQuery,
        toggleCategory,
        setServiceType: setActiveServiceType,
        toggleTag,
        openDetail,
        closeDetail,
        clearFilters,
      }}
    >
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider")
  return ctx
}
