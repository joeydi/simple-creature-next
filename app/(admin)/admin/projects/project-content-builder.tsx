"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
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
import { Project } from "./types"
import { Block, ProjectContent } from "@/lib/schemas/project-content"
import { createEmptyContent, createNewBlock, validateProjectContent } from "@/lib/project-content-utils"
import { SortableBlockWrapper } from "./blocks/sortable-block-wrapper"
import { FullWidthMediaBlock } from "./blocks/full-width-media-block"
import { FullWidthContentBlock } from "./blocks/full-width-content-block"
import { ContentWithMediaBlock } from "./blocks/content-with-media-block"
import { MediaGridBlock } from "./blocks/media-grid-block"
import { AddBlockDropdown } from "./blocks/add-block-dropdown"
import { getAssetsByIds } from "../assets/actions"
import type { Asset } from "../assets/types"

interface Props {
  project: Project
}

export interface ProjectContentBuilderRef {
  refreshAssets: () => Promise<number>
}

export const ProjectContentBuilder = forwardRef<ProjectContentBuilderRef, Props>(function ProjectContentBuilder(
  { project },
  ref,
) {
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

  const addBlock = (type: Block["type"], position?: number) => {
    const newBlock = createNewBlock(type)
    setContent((currentContent) => {
      const blocks = [...currentContent.blocks]
      if (position !== undefined) {
        blocks.splice(position, 0, newBlock)
      } else {
        blocks.push(newBlock)
      }
      return {
        ...currentContent,
        blocks,
      }
    })
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

  // Extract all asset IDs from content blocks
  const getAssetIdsFromContent = (projectContent: ProjectContent): string[] => {
    const ids: string[] = []
    for (const block of projectContent.blocks) {
      if (block.type === "full-width-media" && block.asset) {
        ids.push(block.asset.id)
      } else if (block.type === "content-with-media" || block.type === "media-grid") {
        ids.push(...block.assets.map((a) => a.id))
      }
    }
    return [...new Set(ids)] // dedupe
  }

  // Update blocks with fresh asset data
  const updateBlocksWithFreshAssets = (
    projectContent: ProjectContent,
    assetMap: Map<string, Asset>,
  ): ProjectContent => {
    return {
      blocks: projectContent.blocks.map((block) => {
        if (block.type === "full-width-media" && block.asset) {
          const freshAsset = assetMap.get(block.asset.id)
          return { ...block, asset: freshAsset || block.asset }
        } else if (block.type === "content-with-media") {
          return {
            ...block,
            assets: block.assets.map((a) => assetMap.get(a.id) || a),
          }
        } else if (block.type === "media-grid") {
          return {
            ...block,
            assets: block.assets.map((a) => assetMap.get(a.id) || a),
          }
        }
        return block
      }) as Block[],
    }
  }

  // Expose refreshAssets method to parent via ref
  useImperativeHandle(ref, () => ({
    refreshAssets: async () => {
      const assetIds = getAssetIdsFromContent(content)
      if (assetIds.length === 0) {
        return 0
      }

      const freshAssets = await getAssetsByIds(assetIds)
      const assetMap = new Map(freshAssets.map((a) => [a.id, a]))

      setContent((currentContent) => updateBlocksWithFreshAssets(currentContent, assetMap))

      return freshAssets.length
    },
  }))

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Content Blocks</label>

      {content.blocks.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
          <div className="w-64 text-center">
            <p className="mb-3 text-sm font-medium text-muted-foreground">No content blocks yet</p>
            <AddBlockDropdown onAddBlock={(type) => addBlock(type, 0)} />
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={content.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {/* Dropdown before first block */}
              <AddBlockDropdown onAddBlock={(type) => addBlock(type, 0)} className="my-2" />

              {content.blocks.map((block, index) => (
                <div key={block.id}>
                  <SortableBlockWrapper block={block} onDelete={() => deleteBlock(block.id)}>
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

                  {/* Dropdown after each block */}
                  <AddBlockDropdown onAddBlock={(type) => addBlock(type, index + 1)} className="my-2" />
                </div>
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
})
