"use client"

import { ReactNode } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { UploadDropzone } from "../assets/upload-dropzone"
import { useAssetSearch } from "@/hooks/use-asset-search"
import { AssetGridItem } from "./blocks/asset-grid-item"

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

interface BaseAssetSelectorModalProps<T extends BaseAsset> {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  assets: T[]
  isLoading: boolean
  onRefresh: () => void
  selectedIds: Set<string>
  onToggleAsset: (asset: T) => void
  selectionIndicator: "checkbox" | "checkmark"
  footer: ReactNode
  selectionCount?: number
}

/**
 * Base modal component for asset selection
 * Used by both single-select and multi-select modals
 */
export function BaseAssetSelectorModal<T extends BaseAsset>({
  open,
  onOpenChange,
  title,
  description,
  assets,
  isLoading,
  onRefresh,
  selectedIds,
  onToggleAsset,
  selectionIndicator,
  footer,
  selectionCount,
}: BaseAssetSelectorModalProps<T>) {
  const { search, setSearch, filteredAssets } = useAssetSearch(assets)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-4xl flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <UploadDropzone onUploadComplete={onRefresh} />

        <div className="flex flex-1 flex-col space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selection Count (for multi-select) */}
          {selectionCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              {selectionCount} {selectionCount === 1 ? "asset" : "assets"} selected
            </div>
          )}

          {/* Asset Grid */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  {search ? `No assets found matching "${search}"` : "No assets available"}
                </p>
                {search && (
                  <Button variant="link" size="sm" onClick={() => setSearch("")} className="mt-2">
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {filteredAssets.map((asset) => (
                  <AssetGridItem
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedIds.has(asset.id)}
                    onSelect={() => onToggleAsset(asset)}
                    selectionIndicator={selectionIndicator}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t pt-4">{footer}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
