"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image as ImageIcon } from "lucide-react"
import { Asset } from "@/lib/schemas/project-content"
import { MultiAssetSelectorModal } from "./multi-asset-selector-modal"
import { SortableAssetItem } from "./sortable-asset-item"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"

export interface MediaGridBlockProps {
  assets: Asset[]
  columns: "1" | "2" | "3" | "4"
  onChange: (data: { assets?: Asset[]; columns?: "1" | "2" | "3" | "4" }) => void
}

export function MediaGridBlock({ assets, columns, onChange }: MediaGridBlockProps) {
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
      {/* Column Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Grid Columns</label>
        <Select
          value={columns}
          onValueChange={(value) => onChange({ columns: value as "1" | "2" | "3" | "4" })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Column</SelectItem>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
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
