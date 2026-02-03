"use client"

import { useState, useCallback } from "react"
import { uploadAsset } from "../assets/actions"
import { ImageIcon, Loader2, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Asset } from "../assets/types"
import { MAX_FILE_SIZE } from "@/lib/constants"

interface ThumbnailDropzoneProps {
  thumbnailAsset: Asset | null
  onAssetUploaded: (asset: Asset) => void
  onClick?: () => void
  onClear?: () => void
}

export function ThumbnailDropzone({ thumbnailAsset, onAssetUploaded, onClick, onClear }: ThumbnailDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type - only images
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "Only image files are allowed" }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }
    }

    return { valid: true }
  }

  const uploadFile = async (file: File) => {
    const validation = validateFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadedAsset = await uploadAsset(formData)

      // Convert to Asset format
      const asset = {
        id: uploadedAsset.id,
        filename: uploadedAsset.filename,
        title: uploadedAsset.title,
        s3Url: uploadedAsset.s3Url,
        fileSize: uploadedAsset.fileSize,
        createdAt: uploadedAsset.createdAt,
      } as Asset

      onAssetUploaded(asset)
      toast.success("Thumbnail uploaded successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image"
      toast.error(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      // Only take the first file
      await uploadFile(droppedFiles[0])
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      await uploadFile(selectedFiles[0])
    }
    // Reset input value so same file can be selected again
    e.target.value = ""
  }

  const handleClick = () => {
    if (isUploading) return

    if (onClick) {
      onClick()
    } else {
      const fileInput = document.getElementById("thumbnail-file-input") as HTMLInputElement
      fileInput?.click()
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-all",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5",
        isUploading ? "pointer-events-none opacity-50" : "",
      )}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : thumbnailAsset ? (
        <>
          <Image
            src={thumbnailAsset.s3Url}
            alt={thumbnailAsset.title || thumbnailAsset.filename}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {onClear && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="z-1 absolute right-2 top-2"
              onClick={onClear}
            >
              <X className="size-5" />
            </Button>
          )}
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100"
            onClick={handleClick}
          >
            <p className="text-sm font-medium text-white">Drop a new image or click to change</p>
          </button>
        </>
      ) : (
        <button type="button" className="flex flex-col items-center gap-2" onClick={handleClick}>
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium">Drop an image here or click to select</p>
          <p className="text-xs text-muted-foreground">Max {MAX_FILE_SIZE / 1024 / 1024}MB</p>
        </button>
      )}
      <input
        type="file"
        id="thumbnail-file-input"
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}
