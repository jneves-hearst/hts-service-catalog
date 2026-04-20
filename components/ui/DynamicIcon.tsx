"use client"

import * as Icons from "lucide-react"

interface DynamicIconProps {
  name: string
  size?: number
  className?: string
}

export function DynamicIcon({ name, size = 20, className }: DynamicIconProps) {
  const Icon = ((Icons as unknown) as Record<string, Icons.LucideIcon>)[name] ?? Icons.Box
  return <Icon size={size} className={className} />
}
