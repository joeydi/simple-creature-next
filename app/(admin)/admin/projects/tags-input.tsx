"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type Tag = [string, string]

interface TagsInputProps {
  defaultValue?: Tag[]
}

interface SortableTagProps {
  id: string
  tag: Tag
  index: number
  onUpdate: (index: number, field: 0 | 1, value: string) => void
  onRemove: (index: number) => void
  disabled: boolean
}

function SortableTag({ id, tag, index, onUpdate, onRemove, disabled }: SortableTagProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <div className="flex-1">
        <Input
          placeholder="Label (e.g., Year)"
          value={tag[0]}
          onChange={(e) => onUpdate(index, 0, e.target.value)}
          name={`tag-${index}-label`}
        />
      </div>
      <div className="flex-1">
        <Input
          placeholder="Value (e.g., 2020)"
          value={tag[1]}
          onChange={(e) => onUpdate(index, 1, e.target.value)}
          name={`tag-${index}-value`}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onRemove(index)}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function TagsInput({ defaultValue = [] }: TagsInputProps) {
  const [tags, setTags] = useState<Tag[]>(
    defaultValue && defaultValue.length > 0 ? defaultValue : [["", ""]]
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addTag = () => {
    setTags([...tags, ["", ""]])
  }

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index))
    }
  }

  const updateTag = (index: number, field: 0 | 1, value: string) => {
    const newTags = [...tags]
    newTags[index][field] = value
    setTags(newTags)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTags((items) => {
        const oldIndex = items.findIndex((_, i) => `tag-${i}` === active.id)
        const newIndex = items.findIndex((_, i) => `tag-${i}` === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tags.map((_, i) => `tag-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tags.map((tag, index) => (
              <SortableTag
                key={`tag-${index}`}
                id={`tag-${index}`}
                tag={tag}
                index={index}
                onUpdate={updateTag}
                onRemove={removeTag}
                disabled={tags.length === 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button type="button" variant="outline" size="sm" onClick={addTag}>
        <Plus className="h-4 w-4" />
        Add Tag
      </Button>
      {/* Hidden input to submit tags as JSON */}
      <input
        type="hidden"
        name="tags"
        value={JSON.stringify(
          tags.filter((tag) => tag[0].trim() !== "" || tag[1].trim() !== "")
        )}
      />
    </div>
  )
}
