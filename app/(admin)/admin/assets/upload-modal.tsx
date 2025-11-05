"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UploadDropzone } from "./upload-dropzone"

export function UploadModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Add New Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Asset</DialogTitle>
          <DialogDescription>
            Upload an image, video, or PDF file
          </DialogDescription>
        </DialogHeader>
        <UploadDropzone onUploadComplete={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
