"use client"

import { useState, useEffect, FormEvent } from "react"
import { useAdmin } from "@/context/AdminContext"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { TagInput } from "@/components/ui/TagInput"
import { DynamicIcon } from "@/components/ui/DynamicIcon"
import { CATEGORIES } from "@/lib/categories"
import { Service, ServiceFeature } from "@/types"
import { Plus, Trash2 } from "lucide-react"

const EMPTY_SERVICE: Omit<Service, "id" | "lastUpdated"> = {
  name: "",
  category: "Applications",
  tags: [],
  serviceType: "Platform",
  icon: "Box",
  owner: { name: "", email: "" },
  summary: "",
  features: [{ name: "", description: "" }],
  sla: { availability: "", responseTime: "", resolutionTime: "", supportHours: "" },
  contact: { email: "", team: "" },
  intakeMethod: "ServiceNow",
}

export function ServiceFormModal() {
  const { isFormOpen, editingService, closeModals, refreshServices } = useAdmin()
  const [form, setForm] = useState<Omit<Service, "id" | "lastUpdated">>(EMPTY_SERVICE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingService) {
      const { id: _id, lastUpdated: _lu, ...rest } = editingService
      setForm(rest)
    } else {
      setForm(EMPTY_SERVICE)
    }
  }, [editingService, isFormOpen])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateFeature(index: number, field: keyof ServiceFeature, value: string) {
    const features = [...form.features]
    features[index] = { ...features[index], [field]: value }
    set("features", features)
  }

  function addFeature() {
    set("features", [...form.features, { name: "", description: "" }])
  }

  function removeFeature(index: number) {
    set("features", form.features.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingService ? `/api/services/${editingService.id}` : "/api/services"
      const method = editingService ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      await refreshServices()
      closeModals()
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = CATEGORIES.map((c) => ({ value: c, label: c }))
  const typeOptions = [
    { value: "Platform", label: "Platform" },
    { value: "Program", label: "Program" },
    { value: "Consulting", label: "Consulting" },
  ]
  const intakeOptions = [
    { value: "ServiceNow", label: "ServiceNow" },
    { value: "Email", label: "Email" },
    { value: "Form", label: "Form" },
  ]

  return (
    <Modal
      isOpen={isFormOpen}
      onClose={closeModals}
      title={editingService ? "Edit Service" : "Add New Service"}
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 px-6 py-5">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                id="name"
                label="Service Name *"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                placeholder="e.g. Active Directory Services"
              />
            </div>
            <Select
              id="category"
              label="Category *"
              value={form.category}
              onChange={(e) => set("category", e.target.value as Service["category"])}
              options={categoryOptions}
            />
            <Select
              id="serviceType"
              label="Service Type *"
              value={form.serviceType}
              onChange={(e) => set("serviceType", e.target.value as Service["serviceType"])}
              options={typeOptions}
            />
          </div>

          {/* Icon */}
          <div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  id="icon"
                  label="Icon Name (Lucide)"
                  value={form.icon}
                  onChange={(e) => set("icon", e.target.value)}
                  placeholder="e.g. ShieldCheck, Database, Cloud"
                />
              </div>
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
                <DynamicIcon name={form.icon} size={18} />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Browse icons at{" "}
              <span className="font-mono">lucide.dev</span>
            </p>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-1">
            <label htmlFor="summary" className="text-sm font-medium text-gray-700">
              Summary *
            </label>
            <textarea
              id="summary"
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              required
              rows={3}
              placeholder="Brief description of what this service does…"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Owner */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Owner</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="ownerName"
                label="Name *"
                value={form.owner.name}
                onChange={(e) => set("owner", { ...form.owner, name: e.target.value })}
                required
              />
              <Input
                id="ownerEmail"
                label="Email *"
                type="email"
                value={form.owner.email}
                onChange={(e) => set("owner", { ...form.owner, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Support Contact</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="contactTeam"
                label="Team *"
                value={form.contact.team}
                onChange={(e) => set("contact", { ...form.contact, team: e.target.value })}
                required
              />
              <Input
                id="contactEmail"
                label="Email *"
                type="email"
                value={form.contact.email}
                onChange={(e) => set("contact", { ...form.contact, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Intake */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="intakeMethod"
              label="Intake Method"
              value={form.intakeMethod}
              onChange={(e) => set("intakeMethod", e.target.value as Service["intakeMethod"])}
              options={intakeOptions}
            />
          </div>

          {/* Tags */}
          <TagInput label="Tags" tags={form.tags} onChange={(tags) => set("tags", tags)} />

          {/* SLA */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">SLA</p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="slaAvailability"
                label="Availability"
                value={form.sla.availability}
                onChange={(e) => set("sla", { ...form.sla, availability: e.target.value })}
                placeholder="e.g. 99.9%"
              />
              <Input
                id="slaResponse"
                label="Response Time"
                value={form.sla.responseTime}
                onChange={(e) => set("sla", { ...form.sla, responseTime: e.target.value })}
                placeholder="e.g. Within 1 hour"
              />
              <Input
                id="slaResolution"
                label="Resolution Time"
                value={form.sla.resolutionTime}
                onChange={(e) => set("sla", { ...form.sla, resolutionTime: e.target.value })}
                placeholder="e.g. 4h Critical / 8h High"
              />
              <Input
                id="slaSupport"
                label="Support Hours"
                value={form.sla.supportHours}
                onChange={(e) => set("sla", { ...form.sla, supportHours: e.target.value })}
                placeholder="e.g. 24/7/365"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Features</p>
            <div className="space-y-3">
              {form.features.map((feature, i) => (
                <div key={i} className="flex gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Feature name"
                      value={feature.name}
                      onChange={(e) => updateFeature(i, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Feature description"
                      value={feature.description}
                      onChange={(e) => updateFeature(i, "description", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="mt-1 flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    disabled={form.features.length === 1}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1.5 text-xs font-medium text-hearst-600 hover:text-hearst-800"
              >
                <Plus size={12} />
                Add Feature
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={closeModals} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : editingService ? "Save Changes" : "Create Service"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
