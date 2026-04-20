"use client"

import { useEffect, useState } from "react"
import { useCatalog } from "@/context/CatalogContext"
import { DynamicIcon } from "@/components/ui/DynamicIcon"
import { CategoryBadge } from "./CategoryBadge"
import { Button } from "@/components/ui/Button"
import { CATEGORY_COLORS } from "@/lib/categories"
import { SERVICENOW_URL } from "@/lib/constants"
import {
  X,
  User,
  Mail,
  ExternalLink,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  BarChart2,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "overview" | "features" | "sla" | "contact"

export function ServiceDetailPanel() {
  const { selectedService, isDetailOpen, closeDetail } = useCatalog()
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isDetailOpen) {
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [isDetailOpen])

  useEffect(() => {
    if (isDetailOpen) setActiveTab("overview")
  }, [selectedService, isDetailOpen])

  useEffect(() => {
    if (!isDetailOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isDetailOpen, closeDetail])

  if (!selectedService && !isDetailOpen) return null

  const service = selectedService
  if (!service) return null

  const colors = CATEGORY_COLORS[service.category]

  const ctaHref =
    service.intakeMethod === "Email"
      ? `mailto:${service.contact.email}`
      : service.intakeMethod === "ServiceNow"
      ? SERVICENOW_URL
      : "#"

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "sla", label: "SLA" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={closeDetail}
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900",
          visible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className={cn("px-6 pb-4 pt-6", colors.bg)}>
          <div className="mb-4 flex items-start justify-between">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colors.bg, colors.text, "border", colors.border)}>
              <DynamicIcon name={service.icon} size={24} />
            </div>
            <button
              onClick={closeDetail}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/60 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">{service.name}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={service.category} />
            <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800/70 dark:text-gray-400">
              {service.serviceType}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 px-6 dark:border-gray-800">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-hearst-600 text-hearst-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  About this service
                </h3>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">{service.summary}</p>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Owner
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <User size={14} className="text-gray-400" />
                  <span>{service.owner.name}</span>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {service.features.length} features included
              </h3>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-hearst-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{feature.name}</p>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "sla" && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Service Level Agreement
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                {[
                  { label: "Availability", value: service.sla.availability, icon: BarChart2 },
                  { label: "Response Time", value: service.sla.responseTime, icon: Clock },
                  { label: "Resolution Time", value: service.sla.resolutionTime, icon: Shield },
                  { label: "Support Hours", value: service.sla.supportHours, icon: Phone },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3",
                      i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                    )}
                  >
                    <row.icon size={15} className="mt-0.5 flex-shrink-0 text-hearst-400" />
                    <div className="flex flex-1 items-start justify-between gap-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.label}</span>
                      <span className="text-right text-sm text-gray-500 dark:text-gray-400">
                        {row.value || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Service Owner
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{service.owner.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <a
                      href={`mailto:${service.owner.email}`}
                      className="text-hearst-600 hover:underline dark:text-hearst-400"
                    >
                      {service.owner.email}
                    </a>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Support Team
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield size={14} className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{service.contact.team}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <a
                      href={`mailto:${service.contact.email}`}
                      className="text-hearst-600 hover:underline dark:text-hearst-400"
                    >
                      {service.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA footer */}
        <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <a href={ctaHref} target={service.intakeMethod === "ServiceNow" ? "_blank" : undefined} rel="noreferrer">
            <Button className="w-full" size="lg">
              <ExternalLink size={16} />
              Request Service
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}
