"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Asset } from "@/lib/schemas/project-content"
import { getMediaAssets } from "../actions"
import { BaseAssetSelectorModal } from "../base-asset-selector-modal"

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

  const loadAssets = async () => {
    setIsLoading(true)
    try {
      const data = await getMediaAssets()
      setAssets(data)
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
  }

  const handleCancel = () => {
    // Reset to original selection
    setLocalSelectedIds(new Set(selectedAssets.map((a) => a.id)))
    onOpenChange(false)
  }

  return (
    <BaseAssetSelectorModal
      open={open}
      onOpenChange={onOpenChange}
      title="Select Media Assets"
      description="Choose one or more image or video assets for this block"
      assets={assets}
      isLoading={isLoading}
      onRefresh={loadAssets}
      selectedIds={localSelectedIds}
      onToggleAsset={toggleAsset}
      selectionIndicator="checkbox"
      selectionCount={localSelectedIds.size}
      footer={
        <>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Selection</Button>
        </>
      }
    />
  )
}
