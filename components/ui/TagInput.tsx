"use client"

import { useState, KeyboardEvent } from "react"
import { X, Plus } from "lucide-react"

interface TagInputProps {
  label?: string
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ label, tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("")

  const addTag = () => {
    const trimmed = input.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput("")
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="min-h-[42px] w-full rounded-lg border border-gray-300 bg-white p-2 focus-within:border-hearst-500 focus-within:ring-2 focus-within:ring-hearst-500/20">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-hearst-50 px-2.5 py-0.5 text-xs font-medium text-hearst-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-hearst-400 hover:text-hearst-700"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag…"
              className="min-w-[80px] flex-1 border-none bg-transparent text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
            {input && (
              <button
                type="button"
                onClick={addTag}
                className="text-hearst-500 hover:text-hearst-700"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400">Press Enter or comma to add a tag</p>
    </div>
  )
}
