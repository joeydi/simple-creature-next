"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil } from "lucide-react"
import { useState, useTransition } from "react"
import { createCategory, updateCategory } from "./actions"

interface CategoryModalProps {
  mode: "create" | "edit"
  category?: {
    id: string
    name: string
    description: string | null
  }
}

export function CategoryModal({ mode, category }: CategoryModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        if (mode === "edit" && category) {
          await updateCategory(category.id, formData)
        } else {
          await createCategory(formData)
        }
        setOpen(false)
      } catch (error) {
        console.error("Error saving category:", error)
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button size="sm">
            <Plus />
            Add New Category
          </Button>
        ) : (
          <Button size="sm" variant="outline">
            <Pencil className="size-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Category" : "Edit Category"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new category to organize your projects." : "Update the category details."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleSubmit(formData)
          }}
        >
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required defaultValue={category?.name} placeholder="e.g., Web Development" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={category?.description || ""}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : mode === "create" ? "Create Category" : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
