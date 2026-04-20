"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Service } from "@/types"

interface AdminState {
  services: Service[]
  isFormOpen: boolean
  isDeleteOpen: boolean
  editingService: Service | null
  deletingService: Service | null
}

interface AdminActions {
  setServices: (services: Service[]) => void
  openCreate: () => void
  openEdit: (service: Service) => void
  openDelete: (service: Service) => void
  closeModals: () => void
  refreshServices: () => Promise<void>
}

const AdminContext = createContext<(AdminState & AdminActions) | null>(null)

export function AdminProvider({ children, initialServices }: { children: ReactNode; initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)

  const openCreate = () => {
    setEditingService(null)
    setIsFormOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditingService(service)
    setIsFormOpen(true)
  }

  const openDelete = (service: Service) => {
    setDeletingService(service)
    setIsDeleteOpen(true)
  }

  const closeModals = () => {
    setIsFormOpen(false)
    setIsDeleteOpen(false)
    setTimeout(() => {
      setEditingService(null)
      setDeletingService(null)
    }, 300)
  }

  const refreshServices = useCallback(async () => {
    const res = await fetch("/api/services")
    const data = await res.json()
    setServices(data)
  }, [])

  return (
    <AdminContext.Provider
      value={{
        services,
        setServices,
        isFormOpen,
        isDeleteOpen,
        editingService,
        deletingService,
        openCreate,
        openEdit,
        openDelete,
        closeModals,
        refreshServices,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}
