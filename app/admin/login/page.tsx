"use client"

import Image from "next/image"
import { useState, FormEvent } from "react"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        window.location.href = "/admin"
        return
      } else {
        setError("Incorrect password. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/Logo.png" alt="Hearst" width={120} height={36} className="object-contain" />
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-sm text-gray-500">HTS Service Catalog</p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6">
            <Input
              id="password"
              label="Admin Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              required
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            <Lock size={15} />
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          <a href="/" className="hover:text-hearst-600 hover:underline">
            ← Back to Service Catalog
          </a>
        </p>
      </div>
    </div>
  )
}
