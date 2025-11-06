"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Image as ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { getImageAssets } from "../actions"
import { TagsInput } from "../tags-input"
import { CategorySelect } from "../category-select"
import { AssetSelectorModal } from "../asset-selector-modal"
import { DeleteProjectButton } from "./delete-project-button"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

interface Asset {
  id: string
  filename: string
  title: string | null
  s3Url: string
  fileSize: number
  createdAt: Date
}

interface Project {
  id: string
  title: string
  shortDescription: string
  longDescription: string | null
  thumbnailId: string | null
  tags: unknown
  content: unknown
  createdAt: Date
  updatedAt: Date
  categoryIds: string[]
}

interface EditProjectFormProps {
  project: Project
  categories: Category[]
  updateProjectAction: (formData: FormData) => Promise<void>
}

export function EditProjectForm({ project, categories, updateProjectAction }: EditProjectFormProps) {
  const [thumbnailAsset, setThumbnailAsset] = useState<Asset | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

  // Load initial thumbnail if exists
  useEffect(() => {
    if (project.thumbnailId) {
      loadInitialThumbnail()
    }
  }, [project.thumbnailId])

  const loadInitialThumbnail = async () => {
    try {
      const assets = await getImageAssets()
      const asset = assets.find((a) => a.id === project.thumbnailId)
      if (asset) {
        setThumbnailAsset(asset)
      }
    } catch (error) {
      console.error("Failed to load thumbnail:", error)
    }
  }

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

  return (
    <>
      <div className="flex gap-6">
        {/* Main Form */}
        <div className="flex-1">
          <Card className="p-6">
            <form id="edit-form" action={updateProjectAction}>
              <input type="hidden" name="thumbnailId" value={thumbnailAsset?.id || ""} />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={project.title}
                    placeholder="Project title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    required
                    defaultValue={project.shortDescription}
                    placeholder="A brief description of the project"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    name="longDescription"
                    defaultValue={project.longDescription || ""}
                    placeholder="Detailed description of the project"
                    rows={8}
                  />
                </div>

                <TagsInput defaultValue={project.tags as [string, string][] | undefined} />

                <CategorySelect categories={categories} defaultSelectedIds={project.categoryIds} />

                <div className="space-y-2">
                  <Label htmlFor="content">Content (JSON)</Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={project.content ? JSON.stringify(project.content, null, 2) : ""}
                    placeholder='{"sections": [], "images": []}'
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground">Enter structured content as JSON</p>
                </div>
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
                <Button type="submit" form="edit-form" className="w-full">
                  Update Project
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Thumbnail</Label>
                {thumbnailAsset ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={thumbnailAsset.s3Url}
                      alt={thumbnailAsset.title || thumbnailAsset.filename}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={handleRemoveThumbnail}
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Button type="button" variant="outline" className="w-full" onClick={() => setIsSelectorOpen(true)}>
                  {thumbnailAsset ? "Change Thumbnail" : "Select Thumbnail"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4" />
                    Created
                  </div>
                  <div className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-4" />
                    Last Updated
                  </div>
                  <div className="font-medium">
                    {new Date(project.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.updatedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AssetSelectorModal
        open={isSelectorOpen}
        onOpenChange={setIsSelectorOpen}
        onSelect={handleAssetSelect}
        selectedAssetId={thumbnailAsset?.id}
      />
    </>
  )
}
