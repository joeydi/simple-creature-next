"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlignLeft, AlignRight, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Asset } from "@/lib/schemas/project-content"
import { MultiAssetSelectorModal } from "./multi-asset-selector-modal"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), {
  ssr: false,
})

export interface ContentWithMediaBlockProps {
  content: string
  assets: Asset[]
  align: "left" | "right"
  width: "small" | "medium" | "large"
  onChange: (data: {
    content?: string
    assets?: Asset[]
    align?: "left" | "right"
    width?: "small" | "medium" | "large"
  }) => void
}

export function ContentWithMediaBlock({ content, assets, align, width, onChange }: ContentWithMediaBlockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRemoveAsset = (assetId: string) => {
    onChange({ assets: assets.filter((a) => a.id !== assetId) })
  }

  const handleSelectAssets = (selectedAssets: Asset[]) => {
    onChange({ assets: selectedAssets })
  }

  return (
    <div className="space-y-4">
      {/* Layout Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Media Alignment</label>
          <ToggleGroup
            type="single"
            variant="outline"
            value={align}
            onValueChange={(value) => value && onChange({ align: value as "left" | "right" })}
            className="justify-start"
          >
            <ToggleGroupItem value="left" aria-label="Align left">
              <AlignLeft className="size-4" />
              <span className="ml-1">Left</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <AlignRight className="size-4" />
              <span className="ml-1">Right</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Media Width</label>
          <Select value={width} onValueChange={(value) => onChange({ width: value as "small" | "medium" | "large" })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (33%)</SelectItem>
              <SelectItem value="medium">Medium (50%)</SelectItem>
              <SelectItem value="large">Large (66%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Editor */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Content</label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(value) => onChange({ content: value || "" })}
            preview="edit"
            height={200}
            visibleDragbar={false}
          />
        </div>
      </div>

      {/* Media Assets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Media Assets</label>
          <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <ImageIcon className="mr-2 size-4" />
            {assets.length > 0 ? "Manage Assets" : "Add Assets"}
          </Button>
        </div>

        {assets.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {assets.map((asset) => (
              <div key={asset.id} className="group relative aspect-video overflow-hidden rounded-lg border">
                {asset.assetType === "image" ? (
                  <Image src={asset.s3Url} alt={asset.altText || asset.filename} fill className="object-cover" />
                ) : asset.assetType === "video" ? (
                  <video src={asset.s3Url} className="h-full w-full object-cover">
                    <track kind="captions" />
                  </video>
                ) : null}

                <button
                  onClick={() => handleRemoveAsset(asset.id)}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  type="button"
                >
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed bg-muted/50">
            <p className="text-sm text-muted-foreground">No assets selected</p>
          </div>
        )}
      </div>

      <MultiAssetSelectorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelect={handleSelectAssets}
        selectedAssets={assets}
      />
    </div>
  )
}
