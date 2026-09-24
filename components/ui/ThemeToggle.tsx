"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"

// Treat the current theme as external browser state (the DOM class + localStorage),
// read via useSyncExternalStore so we never call setState inside an effect while
// still syncing with the class the inline pre-hydration script may have applied.
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark")
}

// Server render (and hydration) has no DOM to read; default to light to match SSR.
function getServerSnapshot() {
  return false
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle() {
    const next = !isDark
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {}
    listeners.forEach((listener) => listener())
  }

  return (
    <button
      data-testid="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hearst-500 bg-gray-900 text-yellow-300 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  )
}
