"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import Image from "next/image"
import { getImageAssets } from "./actions"
import { UploadDropzone } from "../assets/upload-dropzone"
import { Asset } from "../assets/types"

interface AssetSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (asset: Asset) => void
  selectedAssetId?: string | null
}

export function AssetSelectorModal({ open, onOpenChange, onSelect, selectedAssetId }: AssetSelectorModalProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      const data = await getImageAssets()
      setAssets(data)
      setFilteredAssets(data)
    } catch (error) {
      console.error("Failed to load assets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (asset: Asset) => {
    onSelect(asset)
    onOpenChange(false)
    setSearch("")
  }

  const handleClear = () => {
    onSelect({ id: "", filename: "", title: null, s3Url: "", fileSize: 0, createdAt: new Date() } as Asset)
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
      <DialogContent className="flex max-h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Select Thumbnail</DialogTitle>
          <DialogDescription>Choose an image asset to use as the project thumbnail</DialogDescription>
        </DialogHeader>

        <UploadDropzone onUploadComplete={loadAssets} />

        <div className="flex flex-1 flex-col space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
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
                  {search ? `No assets found matching "${search}"` : "No image assets available"}
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
                  <button
                    key={asset.id}
                    onClick={() => handleSelect(asset)}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:border-primary ${
                      selectedAssetId === asset.id
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border"
                    }`}
                  >
                    <Image
                      src={asset.s3Url}
                      alt={asset.title || asset.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="mb-1 line-clamp-2 text-center text-xs font-medium text-white">
                        {asset.title || asset.filename}
                      </p>
                      <p className="text-xs text-white/80">{formatFileSize(asset.fileSize)}</p>
                    </div>
                    {selectedAssetId === asset.id && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                        <svg
                          className="h-4 w-4 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              Clear Selection
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
