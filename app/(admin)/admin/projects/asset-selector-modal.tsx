"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Asset, AssetType } from "../assets/types"
import { getAssets } from "../assets/actions"
import { BaseAssetSelectorModal } from "./base-asset-selector-modal"

interface AssetSelectorModalProps {
  types?: AssetType[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (asset: Asset) => void
  selectedAssetId?: string | null
}

export function AssetSelectorModal({ types, open, onOpenChange, onSelect, selectedAssetId }: AssetSelectorModalProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const selectedIds = useMemo(() => {
    return new Set(selectedAssetId ? [selectedAssetId] : [])
  }, [selectedAssetId])

  // Load assets when modal opens
  useEffect(() => {
    if (open) {
      loadAssets()
    }
  }, [open])

  const loadAssets = async () => {
    setIsLoading(true)
    try {
      const { assets: data } = await getAssets(1, 100, undefined, types)
      setAssets(data)
    } catch (error) {
      console.error("Failed to load assets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (asset: Asset) => {
    onSelect(asset)
    onOpenChange(false)
  }

  const handleClear = () => {
    onSelect({ id: "", filename: "", title: null, s3Url: "", fileSize: 0, createdAt: new Date() } as Asset)
    onOpenChange(false)
  }

  return (
    <BaseAssetSelectorModal
      open={open}
      onOpenChange={onOpenChange}
      title="Select Thumbnail"
      description="Choose an image asset to use as the project thumbnail"
      assets={assets}
      isLoading={isLoading}
      onRefresh={loadAssets}
      selectedIds={selectedIds}
      onToggleAsset={handleSelect}
      selectionIndicator="checkmark"
      footer={
        <>
          <Button variant="outline" onClick={handleClear}>
            <X className="mr-2 size-4" />
            Clear Selection
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </>
      }
    />
  )
}
