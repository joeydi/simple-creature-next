"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { uploadAsset } from "./actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, FileImage, FileVideo, FileText } from "lucide-react"

const ACCEPTED_FILE_TYPES = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  "video/*": [".mp4", ".mov", ".avi", ".webm"],
  "application/pdf": [".pdf"],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function UploadDropzone() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
      return false
    }

    // Check file type
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")
    const isPDF = file.type === "application/pdf"

    if (!isImage && !isVideo && !isPDF) {
      setError("Only images, videos, and PDFs are allowed")
      return false
    }

    return true
  }

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      await uploadAsset(formData)

      // Reset state
      setSelectedFile(null)
      router.refresh()
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <FileImage className="h-8 w-8" />
    if (file.type.startsWith("video/")) return <FileVideo className="h-8 w-8" />
    if (file.type === "application/pdf") return <FileText className="h-8 w-8" />
    return <Upload className="h-8 w-8" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card>
      <CardContent className="p-6">
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors
              ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
              cursor-pointer hover:border-primary hover:bg-primary/5
            `}
          >
            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">
              Drag and drop a file here, or click to select
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              Images, Videos, or PDFs (max {MAX_FILE_SIZE / 1024 / 1024}MB)
            </p>
            <input
              type="file"
              onChange={handleFileSelect}
              accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(",")}
              className="hidden"
              id="file-input"
            />
            <Button asChild variant="outline" size="sm">
              <label htmlFor="file-input" className="cursor-pointer">
                Select File
              </label>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="text-muted-foreground">{getFileIcon(selectedFile)}</div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {error && !selectedFile && (
          <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
