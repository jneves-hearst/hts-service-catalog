"use client"

import { useState } from "react"
import { useAdmin } from "@/context/AdminContext"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Trash2 } from "lucide-react"

export function DeleteConfirmModal() {
  const { isDeleteOpen, deletingService, closeModals, refreshServices } = useAdmin()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!deletingService) return
    setLoading(true)

    try {
      await fetch(`/api/services/${deletingService.id}`, { method: "DELETE" })
      await refreshServices()
      closeModals()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isDeleteOpen} onClose={closeModals} title="Delete Service" size="sm">
      <div className="px-6 py-5">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">{deletingService?.name}</span>? This action
          cannot be undone.
        </p>
      </div>
      <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
        <Button variant="outline" onClick={closeModals} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          <Trash2 size={14} />
          {loading ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </Modal>
  )
}
