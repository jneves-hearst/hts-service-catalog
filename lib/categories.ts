import { Category } from "@/types"

export const CATEGORIES: Category[] = [
  "Security",
  "Identity & Access",
  "Cloud & Infrastructure",
  "Data",
  "Applications",
  "Network",
  "Business Operations",
]

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  "Security": {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  "Identity & Access": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "Cloud & Infrastructure": {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  "Data": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "Applications": {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  "Network": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  "Business Operations": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
}

export const CATEGORY_ICON_MAP: Record<Category, string> = {
  "Security": "ShieldCheck",
  "Identity & Access": "KeyRound",
  "Cloud & Infrastructure": "Cloud",
  "Data": "Database",
  "Applications": "AppWindow",
  "Network": "Network",
  "Business Operations": "Briefcase",
}
