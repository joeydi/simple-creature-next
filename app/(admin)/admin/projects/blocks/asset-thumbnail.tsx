"use client"

import { ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AssetPreview } from "./asset-preview"
import { Asset } from "@/lib/schemas/project-content"

interface AssetThumbnailProps {
  asset: Asset
  onRemove: () => void
  className?: string
  children?: ReactNode
}

/**
 * Reusable asset thumbnail with delete button overlay on hover.
 * Accepts children for additional overlay elements (e.g., drag handle).
 */
export function AssetThumbnail({ asset, onRemove, className, children }: AssetThumbnailProps) {
  return (
    <div className={cn("group relative aspect-video overflow-hidden rounded-lg border", className)}>
      <AssetPreview asset={asset} />

      {children}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 z-10 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
        type="button"
      >
        <X className="h-3 w-3 text-destructive-foreground" />
      </button>
    </div>
  )
}
