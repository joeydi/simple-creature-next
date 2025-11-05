"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { uploadAsset } from "./actions"
import { Button } from "@/components/ui/button"
import { Upload, X, FileImage, FileVideo, FileText, Check, Clock, Loader2, AlertCircle, RotateCw } from "lucide-react"
import { nanoid } from "nanoid"

const ACCEPTED_FILE_TYPES = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  "video/*": [".mp4", ".mov", ".avi", ".webm"],
  "application/pdf": [".pdf"],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_FILE_COUNT = 20
const CONCURRENT_UPLOADS = 3

type FileStatus = "pending" | "uploading" | "success" | "error"

interface FileWithStatus {
  id: string
  file: File
  status: FileStatus
  error?: string
}

export function UploadDropzone({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      }
    }

    // Check file type
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")
    const isPDF = file.type === "application/pdf"

    if (!isImage && !isVideo && !isPDF) {
      return { valid: false, error: "Only images, videos, and PDFs are allowed" }
    }

    return { valid: true }
  }

  const addFiles = (newFiles: File[]) => {
    const currentCount = files.length
    const availableSlots = MAX_FILE_COUNT - currentCount

    if (newFiles.length > availableSlots) {
      alert(`Can only upload ${availableSlots} more files (max ${MAX_FILE_COUNT} total)`)
      newFiles = newFiles.slice(0, availableSlots)
    }

    const filesWithStatus: FileWithStatus[] = newFiles.map((file) => {
      const validation = validateFile(file)
      return {
        id: nanoid(),
        file,
        status: validation.valid ? "pending" : "error",
        error: validation.error,
      }
    })

    setFiles((prev) => [...prev, ...filesWithStatus])
  }

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles)
      }
    },
    [files.length],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(Array.from(selectedFiles))
    }
    // Reset input value so same file can be selected again
    e.target.value = ""
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearAll = () => {
    setFiles([])
  }

  const updateFileStatus = (id: string, status: FileStatus, error?: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status, error } : f)))
  }

  const uploadSingleFile = async (fileWithStatus: FileWithStatus) => {
    updateFileStatus(fileWithStatus.id, "uploading")

    try {
      const formData = new FormData()
      formData.append("file", fileWithStatus.file)
      await uploadAsset(formData)
      updateFileStatus(fileWithStatus.id, "success")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload file"
      updateFileStatus(fileWithStatus.id, "error", errorMessage)
    }
  }

  const uploadWithConcurrency = async (filesToUpload: FileWithStatus[]) => {
    const queue = [...filesToUpload]
    const executing: Promise<void>[] = []

    while (queue.length > 0 || executing.length > 0) {
      // Start new uploads up to concurrency limit
      while (executing.length < CONCURRENT_UPLOADS && queue.length > 0) {
        const fileWithStatus = queue.shift()!
        const promise = uploadSingleFile(fileWithStatus).then(() => {
          executing.splice(executing.indexOf(promise), 1)
        })
        executing.push(promise)
      }

      // Wait for at least one to complete
      if (executing.length > 0) {
        await Promise.race(executing)
      }
    }
  }

  const handleUploadAll = async () => {
    const filesToUpload = files.filter((f) => f.status === "pending" || f.status === "error")

    if (filesToUpload.length === 0) return

    setIsUploading(true)

    await uploadWithConcurrency(filesToUpload)

    setIsUploading(false)
    router.refresh()

    // Check if all files succeeded
    const hasErrors = files.some((f) => f.status === "error")

    if (!hasErrors && onUploadComplete) {
      // All succeeded, close modal and clear
      clearAll()
      onUploadComplete()
    }
    // If there are errors, keep modal open so user can retry
  }

  const retryFile = async (id: string) => {
    const fileWithStatus = files.find((f) => f.id === id)
    if (!fileWithStatus) return

    await uploadSingleFile(fileWithStatus)
    router.refresh()
  }

  const getFileIcon = (file: File, size: string = "h-8 w-8") => {
    if (file.type.startsWith("image/")) return <FileImage className={size} />
    if (file.type.startsWith("video/")) return <FileVideo className={size} />
    if (file.type === "application/pdf") return <FileText className={size} />
    return <Upload className={size} />
  }

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="size-4 text-muted-foreground" />
      case "uploading":
        return <Loader2 className="size-4 animate-spin text-primary" />
      case "success":
        return <Check className="size-4 text-green-600" />
      case "error":
        return <AlertCircle className="size-4 text-destructive" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const pendingCount = files.filter((f) => f.status === "pending").length
  const uploadingCount = files.filter((f) => f.status === "uploading").length
  const successCount = files.filter((f) => f.status === "success").length
  const errorCount = files.filter((f) => f.status === "error").length

  return (
    <div className="space-y-4">
      {/* Dropzone - always visible so users can add more files */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${isUploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-primary hover:bg-primary/5"}`}
      >
        <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">
          {files.length === 0 ? "Drag and drop files here, or click to select" : "Add more files"}
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          Images, Videos, or PDFs (max {MAX_FILE_SIZE / 1024 / 1024}MB each, {MAX_FILE_COUNT} files total)
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(",")}
          className="hidden"
          id="file-input"
          disabled={isUploading || files.length >= MAX_FILE_COUNT}
        />
        <Button asChild variant="outline" size="sm" disabled={isUploading || files.length >= MAX_FILE_COUNT}>
          <label htmlFor="file-input" className="cursor-pointer">
            Select Files
          </label>
        </Button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="flex items-center justify-between text-sm">
            <div>
              {isUploading ? (
                <span className="font-medium">
                  Uploading {uploadingCount} of {files.length} files...
                </span>
              ) : (
                <span>
                  {files.length} file{files.length !== 1 ? "s" : ""} selected
                  {successCount > 0 && <span className="text-green-600"> • {successCount} uploaded</span>}
                  {errorCount > 0 && <span className="text-destructive"> • {errorCount} failed</span>}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={clearAll} disabled={isUploading}>
              Clear All
            </Button>
          </div>

          {/* Files */}
          <div className="max-h-[300px] space-y-2 overflow-y-auto">
            {files.map((fileWithStatus) => (
              <div key={fileWithStatus.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="text-muted-foreground">{getFileIcon(fileWithStatus.file, "h-6 w-6")}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" title={fileWithStatus.file.name}>
                    {fileWithStatus.file.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{formatFileSize(fileWithStatus.file.size)}</p>
                    {fileWithStatus.error && <p className="text-xs text-destructive">• {fileWithStatus.error}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(fileWithStatus.status)}
                  {fileWithStatus.status === "error" && !isUploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => retryFile(fileWithStatus.id)}
                      title="Retry upload"
                    >
                      <RotateCw className="size-4" />
                    </Button>
                  )}
                  {fileWithStatus.status !== "uploading" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(fileWithStatus.id)}
                      disabled={isUploading}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <Button
            onClick={handleUploadAll}
            disabled={isUploading || pendingCount + errorCount === 0}
            className="w-full"
          >
            {isUploading
              ? `Uploading ${uploadingCount} of ${files.length}...`
              : `Upload ${pendingCount + errorCount} File${pendingCount + errorCount !== 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </div>
  )
}
