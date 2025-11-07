"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, X, AlertCircle } from "lucide-react"
import { getImageAssets } from "../actions"
import { TagsInput } from "../tags-input"
import { CategorySelect } from "../category-select"
import { AssetSelectorModal } from "../asset-selector-modal"
import { ThumbnailDropzone } from "../thumbnail-dropzone"
import { DeleteProjectButton } from "./delete-project-button"
import { ProjectContentBuilder } from "../project-content-builder"
import { Category, Project } from "../types"
import { Asset } from "../../assets/types"

interface EditProjectFormProps {
  project: Project
  categories: Category[]
  updateProjectAction: (formData: FormData) => Promise<void>
}

export function EditProjectForm({ project, categories, updateProjectAction }: EditProjectFormProps) {
  const [thumbnailAsset, setThumbnailAsset] = useState<Asset | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [slug, setSlug] = useState(project.slug)
  const [slugChanged, setSlugChanged] = useState(false)

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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value
    setSlug(newSlug)
    // Track if slug was changed from original
    if (newSlug !== project.slug) {
      setSlugChanged(true)
    } else {
      setSlugChanged(false)
    }
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
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="project-slug"
                    className="font-mono"
                  />
                  {slugChanged && (
                    <div className="flex items-start gap-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <p>
                        Warning: Changing the slug will change the project URL. Any existing links to this project will
                        break.
                      </p>
                    </div>
                  )}
                  {!slugChanged && (
                    <p className="text-xs text-muted-foreground">
                      URL-safe identifier - lowercase, alphanumeric, and hyphens only
                    </p>
                  )}
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
                  <ProjectContentBuilder project={project} />

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
                <ThumbnailDropzone
                  thumbnailAsset={thumbnailAsset}
                  onAssetUploaded={handleAssetSelect}
                  onClick={() => setIsSelectorOpen(true)}
                  onClear={handleRemoveThumbnail}
                />
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
