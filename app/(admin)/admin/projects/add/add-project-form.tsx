"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createProject } from "../actions"
import { TagsInput } from "../tags-input"
import { CategorySelect } from "../category-select"
import { AssetSelectorModal } from "../asset-selector-modal"
import { ThumbnailDropzone } from "../thumbnail-dropzone"
import { generateSlug } from "../slug-utils"
import { Asset } from "../../assets/types"
import { Category } from "../types"
import { ProjectContentBuilder } from "../project-content-builder"

export function AddProjectForm({ categories }: { categories: Category[] }) {
  const [thumbnailAsset, setThumbnailAsset] = useState<Asset | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [slug, setSlug] = useState("")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  const handleAssetSelect = (asset: Asset) => {
    if (asset.id) {
      setThumbnailAsset(asset)
    } else {
      setThumbnailAsset(null)
    }
  }

  const handleRemoveThumbnail = () => {
    setThumbnailAsset(null)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    // Only auto-generate slug if user hasn't manually edited it
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value
    setSlug(newSlug)
    // Mark as manually edited if user types something
    if (newSlug !== "") {
      setIsSlugManuallyEdited(true)
    }
  }

  return (
    <>
      <div className="flex gap-6">
        {/* Main Form */}
        <div className="flex-1">
          <Card className="p-6">
            <form id="add-form" action={createProject}>
              <input type="hidden" name="thumbnailId" value={thumbnailAsset?.id || ""} />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="Project title"
                    onChange={handleTitleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    placeholder="project-slug"
                    className="font-mono"
                    value={slug}
                    onChange={handleSlugChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    {isSlugManuallyEdited
                      ? "Custom slug - must be lowercase, alphanumeric, and hyphens only"
                      : "Auto-generated from title - you can edit if needed"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    required
                    placeholder="A brief description of the project"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    placeholder="Detailed description of the project"
                    rows={8}
                  />
                </div>

                <TagsInput />

                <CategorySelect categories={categories} />
              </div>
            </form>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="w-80">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button type="submit" form="add-form" className="w-full">
                  Create Project
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <ThumbnailDropzone
                  thumbnailAsset={thumbnailAsset}
                  onAssetUploaded={handleAssetSelect}
                  onClick={() => setIsSelectorOpen(true)}
                  onClear={handleRemoveThumbnail}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AssetSelectorModal
        types={["image"]}
        open={isSelectorOpen}
        onOpenChange={setIsSelectorOpen}
        onSelect={handleAssetSelect}
        selectedAssetId={thumbnailAsset?.id}
      />
    </>
  )
}
