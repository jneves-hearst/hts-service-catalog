"use client"

import { useAdmin } from "@/context/AdminContext"
import { DynamicIcon } from "@/components/ui/DynamicIcon"
import { CategoryBadge } from "@/components/catalog/CategoryBadge"
import { Button } from "@/components/ui/Button"
import { Pencil, Trash2, Plus } from "lucide-react"

export function ServiceTable() {
  const { services, openCreate, openEdit, openDelete } = useAdmin()

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{services.length}</span> services
        </p>
        <Button onClick={openCreate} size="sm">
          <Plus size={14} />
          Add Service
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">Service</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Owner</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Updated</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, i) => (
                <tr
                  key={service.id}
                  className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${i === services.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <DynamicIcon name={service.icon} size={14} />
                      </div>
                      <span className="font-medium text-gray-900">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <CategoryBadge category={service.category} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{service.serviceType}</td>
                  <td className="px-4 py-3 text-gray-500">{service.owner.name}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(service.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(service)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-hearst-50 hover:text-hearst-600"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => openDelete(service)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
