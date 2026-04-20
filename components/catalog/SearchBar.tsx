"use client"

import { useCallback, useRef } from "react"
import { Search, X } from "lucide-react"
import { useCatalog } from "@/context/CatalogContext"

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useCatalog()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => setSearchQuery(value), 300)
    },
    [setSearchQuery]
  )

  return (
    <div className="relative w-full max-w-xl">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        placeholder="Search services by name, category, or keyword…"
        defaultValue={searchQuery}
        onChange={handleChange}
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-hearst-400 focus:outline-none focus:ring-2 focus:ring-hearst-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-hearst-500"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
