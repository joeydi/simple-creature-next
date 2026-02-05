"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { AssetThumbnail } from "./asset-thumbnail"
import { Asset } from "@/lib/schemas/project-content"

interface SortableAssetItemProps {
  asset: Asset
  onRemove: () => void
}

/**
 * Sortable asset item for drag-and-drop reordering in blocks.
 * Uses AssetThumbnail with drag handle overlay.
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
    <div ref={setNodeRef} style={style}>
      <AssetThumbnail asset={asset} onRemove={onRemove}>
        {/* Drag Handle */}
        <button
          type="button"
          className="absolute left-2 top-2 z-10 cursor-grab touch-none rounded bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </AssetThumbnail>
    </div>
  )
}
