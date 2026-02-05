"use client"

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
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, FileText, Image as ImageIcon, Layout, Grid } from "lucide-react"
import { Project } from "./types"
import { Block, ProjectContent } from "@/lib/schemas/project-content"
import { createEmptyContent, createNewBlock, validateProjectContent } from "@/lib/project-content-utils"
import { SortableBlockWrapper } from "./blocks/sortable-block-wrapper"
import { FullWidthMediaBlock } from "./blocks/full-width-media-block"
import { FullWidthContentBlock } from "./blocks/full-width-content-block"
import { ContentWithMediaBlock } from "./blocks/content-with-media-block"
import { MediaGridBlock } from "./blocks/media-grid-block"

interface Props {
  project: Project
}

export function ProjectContentBuilder({ project }: Props) {
  const [content, setContent] = useState<ProjectContent>(() => {
    // Initialize from project.content or create empty
    if (project.content && validateProjectContent(project.content)) {
      return project.content as ProjectContent
    }
    return createEmptyContent()
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setContent((currentContent) => {
        const oldIndex = currentContent.blocks.findIndex((block) => block.id === active.id)
        const newIndex = currentContent.blocks.findIndex((block) => block.id === over.id)

        return {
          ...currentContent,
          blocks: arrayMove(currentContent.blocks, oldIndex, newIndex),
        }
      })
    }
  }

  const addBlock = (type: Block["type"]) => {
    const newBlock = createNewBlock(type)
    setContent((currentContent) => ({
      ...currentContent,
      blocks: [...currentContent.blocks, newBlock],
    }))
  }

  const deleteBlock = (blockId: string) => {
    setContent((currentContent) => ({
      ...currentContent,
      blocks: currentContent.blocks.filter((block) => block.id !== blockId),
    }))
  }

  const updateBlock = (blockId: string, updates: Record<string, any>) => {
    setContent((currentContent) => ({
      ...currentContent,
      blocks: currentContent.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block,
      ) as Block[],
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Content Blocks</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" type="button">
              <Plus className="mr-2 size-4" />
              Add Block
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => addBlock("full-width-media")}>
              <ImageIcon className="mr-2 size-4" />
              Full-Width Media
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("full-width-content")}>
              <FileText className="mr-2 size-4" />
              Full-Width Content
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("content-with-media")}>
              <Layout className="mr-2 size-4" />
              Content with Media
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("media-grid")}>
              <Grid className="mr-2 size-4" />
              Media Grid
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {content.blocks.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
          <div className="text-center">
            <p className="mb-2 text-sm font-medium text-muted-foreground">No content blocks yet</p>
            <p className="text-xs text-muted-foreground">Click "Add Block" to get started</p>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={content.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {content.blocks.map((block) => (
                <SortableBlockWrapper key={block.id} block={block} onDelete={() => deleteBlock(block.id)}>
                  {block.type === "full-width-media" && (
                    <FullWidthMediaBlock asset={block.asset} onChange={(asset) => updateBlock(block.id, { asset })} />
                  )}
                  {block.type === "full-width-content" && (
                    <FullWidthContentBlock
                      content={block.content}
                      onChange={(content) => updateBlock(block.id, { content })}
                    />
                  )}
                  {block.type === "content-with-media" && (
                    <ContentWithMediaBlock
                      content={block.content}
                      assets={block.assets}
                      align={block.align}
                      width={block.width}
                      onChange={(updates) => updateBlock(block.id, updates)}
                    />
                  )}
                  {block.type === "media-grid" && (
                    <MediaGridBlock
                      assets={block.assets}
                      columns={block.columns}
                      onChange={(updates) => updateBlock(block.id, updates)}
                    />
                  )}
                </SortableBlockWrapper>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Hidden input field that serializes the content to JSON for form submission */}
      <input type="hidden" name="content" value={JSON.stringify(content)} />

      {/* <div className="w-full overflow-hidden">
        <pre className="">{JSON.stringify(content, null, 2)}</pre>
      </div> */}
    </div>
  )
}
