"use client"

import { Service } from "@/types"
import { DynamicIcon } from "@/components/ui/DynamicIcon"
import { CategoryBadge } from "./CategoryBadge"
import { CATEGORY_COLORS } from "@/lib/categories"

interface ServiceCardProps {
  service: Service
  onClick: () => void
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const colors = CATEGORY_COLORS[service.category]

  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col items-start rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-hearst-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hearst-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-hearst-700"
    >
      <div className="mb-4 flex w-full items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${colors.bg} ${colors.text}`}
        >
          <DynamicIcon name={service.icon} size={22} />
        </div>
        <span className="mt-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {service.serviceType}
        </span>
      </div>

      <h3 className="mb-1.5 text-sm font-semibold leading-tight text-gray-900 group-hover:text-hearst-700 dark:text-gray-100 dark:group-hover:text-hearst-300">
        {service.name}
      </h3>

      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
        {service.summary}
      </p>

      <CategoryBadge category={service.category} className="mt-auto" />
    </button>
  )
}
