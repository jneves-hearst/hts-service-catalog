"use client"

import { useCatalog } from "@/context/CatalogContext"
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/categories"
import { Category, ServiceType } from "@/types"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const SERVICE_TYPES: ServiceType[] = ["Platform", "Program", "Consulting"]

export function FilterBar() {
  const {
    services,
    activeCategories,
    activeServiceType,
    activeTags,
    toggleCategory,
    setServiceType,
    toggleTag,
    clearFilters,
  } = useCatalog()

  const allTags = Array.from(new Set(services.flatMap((s) => s.tags))).sort()
  const activeFilterCount = activeCategories.length + (activeServiceType ? 1 : 0) + activeTags.length

  return (
    <div className="space-y-3">
      {/* Categories */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCategories.includes(cat)
            const colors = CATEGORY_COLORS[cat]
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat as Category)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  active
                    ? `${colors.bg} ${colors.text} ${colors.border}`
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Service Type */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Type</p>
        <div className="flex flex-wrap gap-2">
          {SERVICE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setServiceType(activeServiceType === type ? null : type)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                activeServiceType === type
                  ? "border-hearst-300 bg-hearst-50 text-hearst-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs font-medium text-hearst-600 hover:text-hearst-800"
        >
          <X size={12} />
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  )
}
