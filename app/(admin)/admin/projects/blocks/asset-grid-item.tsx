"use client"

import { Check } from "lucide-react"
import { AssetPreview } from "./asset-preview"
import { formatFileSize } from "@/lib/utils"

// Minimal asset interface that both Asset types satisfy
interface BaseAsset {
  id: string
  filename: string
  s3Url: string
  assetType: string
  fileSize: number
  title?: string | null
  altText?: string | null
}

interface AssetGridItemProps {
  asset: BaseAsset
  isSelected: boolean
  onSelect: () => void
  selectionIndicator: "checkbox" | "checkmark"
}

/**
 * Renders a single asset in the modal grid with selection indicator
 */
export function AssetGridItem({ asset, isSelected, onSelect, selectionIndicator }: AssetGridItemProps) {
  return (
    <button
      onClick={onSelect}
      type="button"
      className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:border-primary ${
        isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"
      }`}
    >
      <AssetPreview asset={asset} />

      {/* Hover overlay with file info */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="mb-1 line-clamp-2 text-center text-xs font-medium text-white">
          {asset.title || asset.filename}
        </p>
        <p className="text-xs text-white/80">{formatFileSize(asset.fileSize)}</p>
      </div>

      {/* Selection indicator */}
      {selectionIndicator === "checkbox" ? (
        <div className="absolute left-2 top-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-white bg-black/50 text-white"
            }`}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </div>
        </div>
      ) : isSelected ? (
        <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
          <svg className="size-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : null}
    </button>
  )
}
