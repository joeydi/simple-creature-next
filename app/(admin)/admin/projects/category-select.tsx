"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface CategorySelectProps {
  categories: Category[]
  defaultSelectedIds?: string[]
}

export function CategorySelect({ categories, defaultSelectedIds = [] }: CategorySelectProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds)

  const toggleCategory = (categoryId: string) => {
    setSelectedIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="space-y-2">
      <Label>Categories</Label>
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No categories available. Create categories first to assign them to projects.
        </p>
      ) : (
        <div className="space-y-3 rounded-md border p-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-start space-x-3">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedIds.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category.name}
                </label>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Hidden input to submit categories as JSON */}
      <input
        type="hidden"
        name="categories"
        value={JSON.stringify(selectedIds)}
      />
    </div>
  )
}
