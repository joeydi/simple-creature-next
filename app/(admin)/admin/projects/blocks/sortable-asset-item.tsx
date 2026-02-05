"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"
import { AssetPreview } from "./asset-preview"
import { Asset } from "@/lib/schemas/project-content"

interface SortableAssetItemProps {
  asset: Asset
  onRemove: () => void
}

/**
 * Sortable asset item for drag-and-drop reordering in blocks
 */
export function SortableAssetItem({ asset, onRemove }: SortableAssetItemProps) {
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
      <AssetPreview asset={asset} />

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
