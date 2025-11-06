"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Image as ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { createProject } from "../actions"
import { TagsInput } from "../tags-input"
import { CategorySelect } from "../category-select"
import { AssetSelectorModal } from "../asset-selector-modal"

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

export function AddProjectForm({ categories }: { categories: Category[] }) {
  const [thumbnailAsset, setThumbnailAsset] = useState<Asset | null>(null)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

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
            <form id="add-form" action={createProject}>
              <input type="hidden" name="thumbnailId" value={thumbnailAsset?.id || ""} />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" type="text" required placeholder="Project title" />
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

                <div className="space-y-2">
                  <Label htmlFor="content">Content (JSON)</Label>
                  <Textarea id="content" name="content" placeholder='{"sections": [], "images": []}' rows={8} />
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
                <Button type="submit" form="add-form" className="w-full">
                  Create Project
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
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveThumbnail}
                    >
                      <X className="h-4 w-4" />
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
