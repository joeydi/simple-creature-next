"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileImage, FileVideo, FileText, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import type { Asset } from "./types"
import { Card } from "@/components/ui/card"

export function AssetTable({
  assets,
  onEdit,
  onDelete,
}: {
  assets: Asset[]
  onEdit: (asset: Asset) => void
  onDelete: (asset: Asset) => void
}) {
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
        <div className="relative h-12 w-12 overflow-hidden rounded bg-muted">
          <Image src={asset.s3Url} alt={asset.title || asset.filename} fill className="object-cover" sizes="48px" />
        </div>
      )
    }

    const Icon = asset.assetType === "video" ? FileVideo : FileText
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
    )
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      image: "Image",
      video: "Video",
      pdf: "PDF",
    }
    return labels[type] || type
  }

  if (assets.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border">
        <div className="text-center">
          <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">No assets found</p>
          <p className="text-sm text-muted-foreground">Upload your first asset to get started</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden p-0">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[60px]">Preview</TableHead>
            <TableHead>Filename</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{renderThumbnail(asset)}</TableCell>
              <TableCell className="font-medium">
                <div className="max-w-xs truncate" title={asset.title || asset.filename}>
                  {asset.title || asset.filename}
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {getTypeLabel(asset.assetType)}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatFileSize(asset.fileSize)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(asset.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(asset)}>
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(asset)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
