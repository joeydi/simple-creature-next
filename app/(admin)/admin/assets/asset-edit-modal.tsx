"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateAsset } from "./actions"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FileVideo, FileText } from "lucide-react"
import type { Asset, ImageMetadata } from "./types"

export function AssetEditModal({
  asset,
  open,
  onOpenChange,
}: {
  asset: Asset
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(asset.title || "")
  const [description, setDescription] = useState(asset.description || "")
  const [altText, setAltText] = useState(asset.altText || "")
  const [tags, setTags] = useState(
    Array.isArray(asset.tags) ? asset.tags.join(", ") : ""
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("altText", altText)

        // Convert comma-separated tags to array
        const tagsArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)

        formData.append("tags", JSON.stringify(tagsArray))

        await updateAsset(asset.id, formData)
        onOpenChange(false)
        router.refresh()
      } catch (error) {
        console.error("Error updating asset:", error)
      }
    })
  }

  const renderPreview = () => {
    if (asset.assetType === "image") {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={asset.s3Url}
            alt={asset.title || asset.filename}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      )
    }

    const Icon = asset.assetType === "video" ? FileVideo : FileText
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
        <Icon className="h-16 w-16 text-muted-foreground" />
      </div>
    )
  }

  const renderDimensions = () => {
    if (asset.assetType !== "image" || !asset.metadata) {
      return null
    }

    const metadata = asset.metadata as ImageMetadata
    if (!metadata.width || !metadata.height) {
      return null
    }

    return (
      <div>
        <span className="text-muted-foreground">Dimensions:</span>
        <p className="font-medium">
          {metadata.width} × {metadata.height}
        </p>
      </div>
    )
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>Update the metadata for this asset</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderPreview()}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Filename:</span>
              <p className="font-medium">{asset.filename}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p className="font-medium capitalize">{asset.assetType}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Size:</span>
              <p className="font-medium">{formatFileSize(asset.fileSize)}</p>
            </div>
            {renderDimensions()}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for this asset"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description"
                rows={3}
                disabled={isPending}
              />
            </div>

            {asset.assetType === "image" && (
              <div className="space-y-2">
                <Label htmlFor="altText">Alt Text</Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image for accessibility"
                  disabled={isPending}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple tags with commas (e.g., portrait, outdoors, sunset)
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
