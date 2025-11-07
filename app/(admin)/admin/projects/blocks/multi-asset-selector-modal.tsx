"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Check } from "lucide-react"
import Image from "next/image"
import { Asset } from "@/lib/schemas/project-content"
import { getMediaAssets } from "../actions"
import { UploadDropzone } from "../../assets/upload-dropzone"

interface MultiAssetSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (assets: Asset[]) => void
  selectedAssets: Asset[]
}

export function MultiAssetSelectorModal({
  open,
  onOpenChange,
  onSelect,
  selectedAssets,
}: MultiAssetSelectorModalProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(new Set())

  // Initialize local selected IDs from props
  useEffect(() => {
    setLocalSelectedIds(new Set(selectedAssets.map((a) => a.id)))
  }, [selectedAssets])

  // Load assets when modal opens
  useEffect(() => {
    if (open) {
      loadAssets()
    }
  }, [open])

  // Filter assets based on search
  useEffect(() => {
    if (search) {
      const filtered = assets.filter((asset) => {
        const searchLower = search.toLowerCase()
        return (
          asset.filename.toLowerCase().includes(searchLower) ||
          (asset.title && asset.title.toLowerCase().includes(searchLower))
        )
      })
      setFilteredAssets(filtered)
    } else {
      setFilteredAssets(assets)
    }
  }, [search, assets])

  const loadAssets = async () => {
    setIsLoading(true)
    try {
      const data = await getMediaAssets()
      setAssets(data)
      setFilteredAssets(data)
    } catch (error) {
      console.error("Failed to load assets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAsset = (asset: Asset) => {
    const newSelectedIds = new Set(localSelectedIds)
    if (newSelectedIds.has(asset.id)) {
      newSelectedIds.delete(asset.id)
    } else {
      newSelectedIds.add(asset.id)
    }
    setLocalSelectedIds(newSelectedIds)
  }

  const handleConfirm = () => {
    const selectedAssetsList = assets.filter((asset) => localSelectedIds.has(asset.id))
    onSelect(selectedAssetsList)
    onOpenChange(false)
    setSearch("")
  }

  const handleCancel = () => {
    // Reset to original selection
    setLocalSelectedIds(new Set(selectedAssets.map((a) => a.id)))
    onOpenChange(false)
    setSearch("")
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-4xl flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>Select Media Assets</DialogTitle>
          <DialogDescription>Choose one or more image or video assets for this block</DialogDescription>
        </DialogHeader>

        <UploadDropzone onUploadComplete={loadAssets} />

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

          {/* Selection Count */}
          <div className="text-sm text-muted-foreground">
            {localSelectedIds.size} {localSelectedIds.size === 1 ? "asset" : "assets"} selected
          </div>

          {/* Asset Grid */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Loading assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  {search ? `No assets found matching "${search}"` : "No media assets available"}
                </p>
                {search && (
                  <Button variant="link" size="sm" onClick={() => setSearch("")} className="mt-2">
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {filteredAssets.map((asset) => {
                  const isSelected = localSelectedIds.has(asset.id)
                  return (
                    <button
                      key={asset.id}
                      onClick={() => toggleAsset(asset)}
                      type="button"
                      className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:border-primary ${
                        isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"
                      }`}
                    >
                      {asset.assetType === "image" ? (
                        <Image
                          src={asset.s3Url}
                          alt={asset.altText || asset.filename}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      ) : asset.assetType === "video" ? (
                        <video src={asset.s3Url} className="h-full w-full object-cover">
                          <track kind="captions" />
                        </video>
                      ) : null}

                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="mb-1 line-clamp-2 text-center text-xs font-medium text-white">
                          {asset.title || asset.filename}
                        </p>
                        <p className="text-xs text-white/80">{formatFileSize(asset.fileSize)}</p>
                      </div>

                      {/* Checkbox indicator */}
                      <div className="absolute left-2 top-2">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-white bg-black/50 text-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Selection</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
