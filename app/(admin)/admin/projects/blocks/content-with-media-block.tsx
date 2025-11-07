"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlignLeft, AlignRight, X, Image as ImageIcon, GripVertical } from "lucide-react"
import Image from "next/image"
import { Asset } from "@/lib/schemas/project-content"
import { MultiAssetSelectorModal } from "./multi-asset-selector-modal"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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

// Sortable asset item component
function SortableAssetItem({ asset, onRemove }: { asset: Asset; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: asset.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="group relative aspect-video overflow-hidden rounded-lg border">
      {/* Drag Handle */}
      <button
        type="button"
        className="absolute left-2 top-2 z-10 cursor-grab touch-none rounded bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Asset Preview */}
      {asset.assetType === "image" ? (
        <Image src={asset.s3Url} alt={asset.altText || asset.filename} fill className="object-cover" />
      ) : asset.assetType === "video" ? (
        <video src={asset.s3Url} className="h-full w-full object-cover">
          <track kind="captions" />
        </video>
      ) : null}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 z-10 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
        type="button"
      >
        <X className="h-3 w-3 text-destructive-foreground" />
      </button>
    </div>
  )
}

export function ContentWithMediaBlock({ content, assets, align, width, onChange }: ContentWithMediaBlockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = assets.findIndex((asset) => asset.id === active.id)
      const newIndex = assets.findIndex((asset) => asset.id === over.id)
      const reorderedAssets = arrayMove(assets, oldIndex, newIndex)
      onChange({ assets: reorderedAssets })
    }
  }

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
              <SelectItem value="small">Small (6 / 12)</SelectItem>
              <SelectItem value="medium">Medium (7 / 12)</SelectItem>
              <SelectItem value="large">Large (8 / 12)</SelectItem>
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={assets.map((a) => a.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {assets.map((asset) => (
                  <SortableAssetItem
                    key={asset.id}
                    asset={asset}
                    onRemove={() => handleRemoveAsset(asset.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
