"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const RECOMMENDED_MAX = 160

interface MetaDescriptionFieldProps {
  defaultValue?: string | null
}

export function MetaDescriptionField({ defaultValue }: MetaDescriptionFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "")
  const isOverLimit = value.length > RECOMMENDED_MAX

  return (
    <div className="space-y-2">
      <Label htmlFor="metaDescription">Meta Description</Label>
      <Textarea
        id="metaDescription"
        name="metaDescription"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Description used for search engines and social sharing. Falls back to long description."
        rows={3}
      />
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Falls back to the long description when left empty.
        </span>
        <span className={cn("tabular-nums", isOverLimit ? "font-medium text-orange-600 dark:text-orange-400" : "text-muted-foreground")}>
          {value.length} / {RECOMMENDED_MAX}
          {isOverLimit && " — over recommended length"}
        </span>
      </div>
    </div>
  )
}
