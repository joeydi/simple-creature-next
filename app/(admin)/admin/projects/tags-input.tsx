"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

type Tag = [string, string]

interface TagsInputProps {
  defaultValue?: Tag[]
}

export function TagsInput({ defaultValue = [] }: TagsInputProps) {
  const [tags, setTags] = useState<Tag[]>(defaultValue && defaultValue.length > 0 ? defaultValue : [["", ""]])

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

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="space-y-3">
        {tags.map((tag, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Label (e.g., Year)"
                value={tag[0]}
                onChange={(e) => updateTag(index, 0, e.target.value)}
                name={`tag-${index}-label`}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Value (e.g., 2020)"
                value={tag[1]}
                onChange={(e) => updateTag(index, 1, e.target.value)}
                name={`tag-${index}-value`}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeTag(index)}
              disabled={tags.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addTag}>
        <Plus className="h-4 w-4" />
        Add Tag
      </Button>
      {/* Hidden input to submit tags as JSON */}
      <input
        type="hidden"
        name="tags"
        value={JSON.stringify(tags.filter((tag) => tag[0].trim() !== "" || tag[1].trim() !== ""))}
      />
    </div>
  )
}
