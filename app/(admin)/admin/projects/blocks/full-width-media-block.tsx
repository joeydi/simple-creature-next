"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Video, X } from "lucide-react"
import Image from "next/image"
import { Asset } from "@/lib/schemas/project-content"
import { AssetSelectorModal } from "../asset-selector-modal"

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
          <Button variant="ghost" size="sm" onClick={handleRemoveAsset}>
            <X className="mr-1 size-4" />
            Remove
          </Button>
        )}
      </div>

      {asset ? (
        <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
          {/* Preview */}
          <div className="relative aspect-video overflow-hidden rounded-md bg-background">
            {asset.assetType === "image" ? (
              <Image src={asset.s3Url} alt={asset.altText || asset.filename} fill className="object-cover" />
            ) : asset.assetType === "video" ? (
              <video src={asset.s3Url} controls className="h-full w-full">
                <track kind="captions" />
              </video>
            ) : null}
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-sm">
            {asset.title && (
              <div>
                <span className="font-medium">Title:</span> {asset.title}
              </div>
            )}
            {asset.altText && (
              <div>
                <span className="font-medium">Alt Text:</span> {asset.altText}
              </div>
            )}
            <div className="flex gap-4 text-muted-foreground">
              <span>
                {asset.assetType === "image" && asset.metadata && "width" in asset.metadata
                  ? `${asset.metadata.width} × ${asset.metadata.height}`
                  : ""}
              </span>
              <span>{(asset.fileSize / 1024).toFixed(2)} KB</span>
            </div>
          </div>

          <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="w-full">
            Change Media
          </Button>
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
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelectAsset}
        selectedAssetId={asset?.id}
      />
    </div>
  )
}
