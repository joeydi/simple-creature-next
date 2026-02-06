"use client"

import { useState, useTransition, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateAsset, getUploadUrl, replaceAsset } from "./actions"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FileVideo, FileText, Sparkles, Upload, Loader2 } from "lucide-react"
import type { Asset, ImageMetadata } from "./types"
import { AltTextGeneratorDialog } from "./alt-text-generator-dialog"
import { MAX_FILE_SIZE } from "@/lib/constants"

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
  const [tags, setTags] = useState(Array.isArray(asset.tags) ? asset.tags.join(", ") : "")
  const [showAltGenerator, setShowAltGenerator] = useState(false)

  // File replacement state
  const [currentAsset, setCurrentAsset] = useState(asset)
  const [isReplacing, setIsReplacing] = useState(false)
  const [replaceError, setReplaceError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptedTypes = () => {
    switch (currentAsset.assetType) {
      case "image":
        return "image/*"
      case "video":
        return "video/*"
      case "pdf":
        return "application/pdf"
      default:
        return ""
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so same file can be selected again
    e.target.value = ""

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setReplaceError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
      return
    }

    // Validate file type matches asset type
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")
    const isPDF = file.type === "application/pdf"

    if (
      (currentAsset.assetType === "image" && !isImage) ||
      (currentAsset.assetType === "video" && !isVideo) ||
      (currentAsset.assetType === "pdf" && !isPDF)
    ) {
      setReplaceError(`Please select a ${currentAsset.assetType} file`)
      return
    }

    setIsReplacing(true)
    setReplaceError(null)

    try {
      // Step 1: Get presigned URL
      const { presignedUrl, s3Key, s3Url } = await getUploadUrl(file.name, file.type, file.size)

      // Step 2: Upload to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`)
      }

      // Step 3: Replace asset in database
      const updatedAsset = await replaceAsset(currentAsset.id, {
        s3Key,
        s3Url,
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size,
      })

      // Update local state with new asset data
      setCurrentAsset(updatedAsset as Asset)
      router.refresh()
    } catch (err) {
      console.error("Error replacing file:", err)
      setReplaceError(err instanceof Error ? err.message : "Failed to replace file")
    } finally {
      setIsReplacing(false)
    }
  }

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
    if (currentAsset.assetType === "image") {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={currentAsset.s3Url}
            alt={currentAsset.title || currentAsset.filename}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
            key={currentAsset.s3Url}
          />
        </div>
      )
    }

    const Icon = currentAsset.assetType === "video" ? FileVideo : FileText
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted">
        <Icon className="h-16 w-16 text-muted-foreground" />
      </div>
    )
  }

  const renderDimensions = () => {
    if (currentAsset.assetType !== "image" || !currentAsset.metadata) {
      return null
    }

    const metadata = currentAsset.metadata as ImageMetadata
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
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update the metadata for this asset</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {renderPreview()}

            {/* Replace File Button */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={getAcceptedTypes()}
                className="hidden"
                disabled={isReplacing || isPending}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isReplacing || isPending}
              >
                {isReplacing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Replacing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Replace File
                  </>
                )}
              </Button>
              {replaceError && <p className="text-sm text-destructive">{replaceError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Filename:</span>
                <p className="font-medium">{currentAsset.filename}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p className="font-medium capitalize">{currentAsset.assetType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Size:</span>
                <p className="font-medium">{formatFileSize(currentAsset.fileSize)}</p>
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
                  disabled={isPending || isReplacing}
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
                  disabled={isPending || isReplacing}
                />
              </div>

              {currentAsset.assetType === "image" && (
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <Label htmlFor="altText">Alt Text</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAltGenerator(true)}
                      disabled={isPending || isReplacing}
                      className="h-auto gap-1 px-2 py-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Generate
                    </Button>
                  </div>
                  <Textarea
                    id="altText"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe the image for accessibility"
                    rows={2}
                    disabled={isPending || isReplacing}
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
                  disabled={isPending || isReplacing}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple tags with commas (e.g., portrait, outdoors, sunset)
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending || isReplacing}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || isReplacing}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alt Text Generator Dialog */}
      {currentAsset.assetType === "image" && (
        <AltTextGeneratorDialog
          open={showAltGenerator}
          onOpenChange={setShowAltGenerator}
          imageUrl={currentAsset.s3Url}
          onAccept={(text) => {
            setAltText(text)
            setShowAltGenerator(false)
          }}
        />
      )}
    </>
  )
}
