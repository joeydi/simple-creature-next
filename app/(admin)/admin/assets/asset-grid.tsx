"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileImage, FileVideo, FileText } from "lucide-react"
import Image from "next/image"
import type { Asset } from "./types"

export function AssetGrid({ assets, onEdit }: { assets: Asset[]; onEdit: (asset: Asset) => void }) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const renderThumbnail = (asset: Asset) => {
    if (asset.assetType === "image") {
      return (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={asset.s3Url}
            alt={asset.title || asset.filename}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )
    }

    const Icon = asset.assetType === "video" ? FileVideo : FileText
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-muted">
        <Icon className="h-16 w-16 text-muted-foreground" />
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
        <div className="text-center">
          <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">No assets found</p>
          <p className="text-sm text-muted-foreground">Upload your first asset to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => (
        <Card
          key={asset.id}
          className="group cursor-pointer overflow-hidden py-0 transition-shadow hover:shadow-md"
          onClick={() => onEdit(asset)}
        >
          <CardContent className="p-0">
            {renderThumbnail(asset)}
            <div className="p-3">
              <p className="truncate text-sm font-medium" title={asset.title || asset.filename}>
                {asset.title || asset.filename}
              </p>
              <p className="text-xs text-muted-foreground">{formatFileSize(asset.fileSize)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
