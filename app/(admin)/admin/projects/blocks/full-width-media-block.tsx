"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Video } from "lucide-react"
import { Asset } from "@/lib/schemas/project-content"
import { AssetSelectorModal } from "../asset-selector-modal"
import { AssetThumbnail } from "./asset-thumbnail"

export interface FullWidthMediaBlockProps {
  asset: Asset | null
  onChange: (asset: Asset | null) => void
}

export function FullWidthMediaBlock({ asset, onChange }: FullWidthMediaBlockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRemoveAsset = () => {
    onChange(null)
  }

  const handleSelectAsset = (selectedAsset: Asset) => {
    onChange(selectedAsset)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Media Asset</label>
        {asset && (
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <ImageIcon className="mr-2 size-4" />
            Manage Asset
          </Button>
        )}
      </div>

      {asset ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <AssetThumbnail asset={asset} onRemove={handleRemoveAsset} />
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsModalOpen(true)} className="h-24 w-full">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <ImageIcon className="h-5 w-5" />
              <Video className="h-5 w-5" />
            </div>
            <span>Select Image or Video</span>
          </div>
        </Button>
      )}

      <AssetSelectorModal
        types={["image", "video"]}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelectAsset}
        selectedAssetId={asset?.id}
      />
    </div>
  )
}
